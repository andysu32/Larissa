import { db } from "./db";
import { podePublicar } from "./guardas";
import { dentroDoLimite } from "./limites";
import { somarReputacao } from "./reputacao";
import { pedirParecer } from "./revisor";
import {
  deltaClareza,
  deltaContribuicaoVeredito,
  deltaPrecisao,
  ehEstado,
  type Estado,
} from "./regras";
import { apresentarAutor, MENSAGEM_FRAUDE, normalizarBusca, pareceFraudeAcademica, urlOpcionalValida } from "./texto";
import type { Resultado, UsuarioAtual } from "./tipos";

const REABRE = new Set(["correta", "verificada_especialista", "parcialmente_correta", "incorreta"]);

export type RespostaPublica = {
  id: string;
  corpo: string;
  estado: string;
  explicacaoVeredito: string;
  autor: string;
  autorId: string;
  criadaEm: Date;
  fontes: { titulo: string; url: string; citacao: string }[];
  parecer: { confianca: string; texto: string } | null;
  votosApoio: number;
  meuVoto: number | null;
};

export type PerguntaDetalhe = {
  id: string;
  titulo: string;
  corpo: string;
  dificuldade: string;
  nivelEducacional: string;
  objetivo: string;
  criadaEm: Date;
  autor: string;
  autorId: string;
  assuntos: { id: string; nome: string; slug: string }[];
  respostas: RespostaPublica[];
};

export async function obterPergunta(
  id: string,
  usuario: UsuarioAtual | null,
): Promise<PerguntaDetalhe | null> {
  const pergunta = await db.pergunta.findUnique({
    where: { id },
    include: {
      autor: { include: { perfil: true } },
      nos: { include: { no: true } },
      respostas: {
        where: { oculto: false },
        orderBy: { criadaEm: "asc" },
        include: {
          autor: { include: { perfil: true } },
          fontes: true,
          pareceres: { orderBy: { criadoEm: "desc" }, take: 1 },
          votos: true,
        },
      },
    },
  });
  if (!pergunta || pergunta.oculto) return null;

  return {
    id: pergunta.id,
    titulo: pergunta.titulo,
    corpo: pergunta.corpo,
    dificuldade: pergunta.dificuldade,
    nivelEducacional: pergunta.nivelEducacional,
    objetivo: pergunta.objetivo,
    criadaEm: pergunta.criadaEm,
    autor: apresentarAutor(pergunta.autor),
    autorId: pergunta.autorId,
    assuntos: pergunta.nos.map((item) => ({
      id: item.no.id,
      nome: item.no.nome,
      slug: item.no.slug,
    })),
    respostas: pergunta.respostas.map((resposta) => ({
      id: resposta.id,
      corpo: resposta.corpo,
      estado: resposta.estado,
      explicacaoVeredito: resposta.explicacaoVeredito,
      autor: apresentarAutor(resposta.autor),
      autorId: resposta.autorId,
      criadaEm: resposta.criadaEm,
      fontes: resposta.fontes.map((fonte) => ({
        titulo: fonte.titulo,
        url: fonte.url,
        citacao: fonte.citacao,
      })),
      parecer: resposta.pareceres[0]
        ? { confianca: resposta.pareceres[0].confianca, texto: resposta.pareceres[0].texto }
        : null,
      votosApoio: resposta.votos.filter((voto) => voto.valor === 1).length,
      meuVoto: usuario
        ? (resposta.votos.find((voto) => voto.usuarioId === usuario.id)?.valor ?? null)
        : null,
    })),
  };
}

export async function criarResposta(
  usuario: UsuarioAtual,
  input: {
    perguntaId: string;
    corpo: string;
    fontes: { titulo: string; url: string; citacao: string }[];
  },
): Promise<Resultado<{ id: string }>> {
  const publicacao = podePublicar(usuario);
  if (!publicacao.ok) return publicacao;
  const limite = await dentroDoLimite(usuario.id, "resposta");
  if (!limite.ok) return limite;

  const corpo = input.corpo.trim();
  if (corpo.length < 20 || corpo.length > 8000) {
    return { ok: false, erro: "A resposta precisa explicar o raciocínio, não só o resultado." };
  }
  if (pareceFraudeAcademica(corpo)) return { ok: false, erro: MENSAGEM_FRAUDE };

  const fontes = input.fontes
    .map((fonte) => ({
      titulo: fonte.titulo.trim(),
      url: fonte.url.trim(),
      citacao: fonte.citacao.trim(),
    }))
    .filter((fonte) => fonte.titulo || fonte.url || fonte.citacao)
    .slice(0, 3);
  for (const fonte of fontes) {
    if (fonte.titulo.length < 2) return { ok: false, erro: "Dê um título para a fonte citada." };
    if (!urlOpcionalValida(fonte.url)) return { ok: false, erro: "A fonte precisa ser um link http ou https." };
  }

  const pergunta = await db.pergunta.findUnique({
    where: { id: input.perguntaId },
    include: { respostas: { where: { oculto: false }, select: { corpo: true } } },
  });
  if (!pergunta || pergunta.oculto) return { ok: false, erro: "Não encontramos a pergunta." };
  if (pergunta.respostas.some((item) => normalizarBusca(item.corpo) === normalizarBusca(corpo))) {
    return { ok: false, erro: "Essa resposta repete outra já publicada nesta pergunta." };
  }

  const criada = await db.$transaction(async (tx) => {
    const resposta = await tx.resposta.create({
      data: {
        corpo,
        perguntaId: pergunta.id,
        autorId: usuario.id,
        estado: "nao_verificada",
        fontes: { create: fontes },
      },
    });
    await somarReputacao(
      tx,
      usuario.id,
      { contribuicao: 1 },
      "resposta_criada",
      "Publicou uma resposta para revisão.",
    );
    return resposta;
  });

  await pedirParecer(criada.id);
  return { ok: true, id: criada.id };
}

export async function editarResposta(
  usuario: UsuarioAtual,
  input: { respostaId: string; corpo: string },
): Promise<Resultado> {
  const publicacao = podePublicar(usuario);
  if (!publicacao.ok) return publicacao;
  const corpo = input.corpo.trim();
  if (corpo.length < 20 || corpo.length > 8000) {
    return { ok: false, erro: "A resposta precisa explicar o raciocínio." };
  }
  if (pareceFraudeAcademica(corpo)) return { ok: false, erro: MENSAGEM_FRAUDE };

  const atual = await db.resposta.findUnique({ where: { id: input.respostaId } });
  if (!atual || atual.oculto) return { ok: false, erro: "Não encontramos a resposta." };
  if (atual.autorId !== usuario.id) return { ok: false, erro: "Só quem escreveu pode editar." };
  if (!ehEstado(atual.estado)) return { ok: false, erro: "Estado inválido." };
  const estadoAtual: Estado = atual.estado;
  const novoEstado: Estado = REABRE.has(estadoAtual) ? "revisao_humana" : estadoAtual;
  await db.$transaction(async (tx) => {
    await tx.resposta.update({
      where: { id: atual.id },
      data: { corpo, estado: novoEstado },
    });
    await somarReputacao(
      tx,
      atual.autorId,
      {
        precisao: deltaPrecisao(estadoAtual, novoEstado),
        contribuicao: deltaContribuicaoVeredito(estadoAtual, novoEstado),
      },
      "edicao_reaberta",
      "A resposta foi editada e o veredito anterior foi reaberto.",
    );
    await tx.revisaoConteudo.create({
      data: {
        alvoTipo: "resposta",
        alvoId: atual.id,
        editorId: usuario.id,
        resumo: "Edição da resposta. Se havia veredito, ele voltou para revisão humana.",
      },
    });
  });
  return { ok: true };
}

export async function votarClareza(
  usuario: UsuarioAtual,
  respostaId: string,
  valor: number,
): Promise<Resultado> {
  if (valor !== 1 && valor !== -1) return { ok: false, erro: "Voto inválido." };
  if (usuario.bloqueado) return { ok: false, erro: "Esta conta está bloqueada." };
  const limite = await dentroDoLimite(usuario.id, "voto");
  if (!limite.ok) return limite;

  const resposta = await db.resposta.findUnique({ where: { id: respostaId } });
  if (!resposta || resposta.oculto) return { ok: false, erro: "Não encontramos a resposta." };
  if (resposta.autorId === usuario.id) {
    return { ok: false, erro: "Você não avalia a própria resposta. Este voto também não muda se ela está correta." };
  }

  const anterior = await db.voto.findUnique({
    where: { usuarioId_respostaId: { usuarioId: usuario.id, respostaId } },
  });
  const delta = deltaClareza(anterior?.valor ?? null, valor);
  await db.$transaction(async (tx) => {
    await tx.voto.upsert({
      where: { usuarioId_respostaId: { usuarioId: usuario.id, respostaId } },
      create: { usuarioId: usuario.id, respostaId, valor },
      update: { valor },
    });
    await somarReputacao(
      tx,
      resposta.autorId,
      { clareza: delta },
      "voto_clareza",
      valor === 1 ? "Alguém marcou a resposta como clara." : "Alguém marcou a resposta como confusa.",
    );
  });
  return { ok: true };
}

export type ItemRevisao = {
  id: string;
  trecho: string;
  estado: string;
  criadaEm: Date;
  autor: string;
  perguntaId: string;
  perguntaTitulo: string;
};

export async function listarPendentes(limite = 40): Promise<ItemRevisao[]> {
  const respostas = await db.resposta.findMany({
    where: {
      oculto: false,
      pergunta: { oculto: false },
      estado: { in: ["revisao_humana", "em_analise", "nao_verificada"] },
    },
    orderBy: { criadaEm: "asc" },
    take: limite,
    include: {
      pergunta: { select: { id: true, titulo: true } },
      autor: { include: { perfil: true } },
    },
  });

  return respostas.map((resposta) => {
    const limpo = resposta.corpo.replace(/\s+/g, " ").trim();
    return {
      id: resposta.id,
      trecho: limpo.length > 180 ? `${limpo.slice(0, 177)}…` : limpo,
      estado: resposta.estado,
      criadaEm: resposta.criadaEm,
      autor: apresentarAutor(resposta.autor),
      perguntaId: resposta.pergunta.id,
      perguntaTitulo: resposta.pergunta.titulo,
    };
  });
}
