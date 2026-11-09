import { db } from "./db";
import { idsDaSubarvore } from "./arvore";
import { podePublicar } from "./guardas";
import { dentroDoLimite } from "./limites";
import { somarReputacao } from "./reputacao";
import { DIFICULDADES, NIVEIS } from "./rotulos";
import { apresentarAutor, MENSAGEM_FRAUDE, normalizarBusca, pareceFraudeAcademica } from "./texto";
import type { Resultado, UsuarioAtual } from "./tipos";

const ORDEM_ESTADO = [
  "verificada_especialista",
  "correta",
  "parcialmente_correta",
  "revisao_humana",
  "em_analise",
  "nao_verificada",
  "incorreta",
];

export type PerguntaLista = {
  id: string;
  titulo: string;
  dificuldade: string;
  nivelEducacional: string;
  objetivo: string;
  criadaEm: Date;
  autor: string;
  assuntos: string[];
  totalRespostas: number;
  melhorEstado: string | null;
};

function melhorEstado(estados: string[]): string | null {
  if (estados.length === 0) return null;
  return [...estados].sort((a, b) => ORDEM_ESTADO.indexOf(a) - ORDEM_ESTADO.indexOf(b))[0] ?? null;
}

export async function listarPerguntas(
  limite = 50,
  filtro?: { assunto?: string; autorId?: string },
): Promise<PerguntaLista[]> {
  const ids = filtro?.assunto ? await idsDaSubarvore(filtro.assunto) : null;
  if (filtro?.assunto && !ids) return [];

  const perguntas = await db.pergunta.findMany({
    where: {
      oculto: false,
      ...(filtro?.autorId ? { autorId: filtro.autorId } : {}),
      ...(ids ? { nos: { some: { noId: { in: ids } } } } : {}),
    },
    orderBy: { criadaEm: "desc" },
    take: limite,
    include: {
      autor: { include: { perfil: true } },
      nos: { include: { no: true } },
      respostas: { where: { oculto: false }, select: { estado: true } },
    },
  });

  return perguntas.map((pergunta) => ({
    id: pergunta.id,
    titulo: pergunta.titulo,
    dificuldade: pergunta.dificuldade,
    nivelEducacional: pergunta.nivelEducacional,
    objetivo: pergunta.objetivo,
    criadaEm: pergunta.criadaEm,
    autor: apresentarAutor(pergunta.autor),
    assuntos: pergunta.nos.map((item) => item.no.nome),
    totalRespostas: pergunta.respostas.length,
    melhorEstado: melhorEstado(pergunta.respostas.map((resposta) => resposta.estado)),
  }));
}

export async function criarPergunta(
  usuario: UsuarioAtual,
  input: {
    titulo: string;
    corpo: string;
    dificuldade: string;
    nivelEducacional: string;
    objetivo: string;
    noIds: string[];
  },
): Promise<Resultado<{ id: string }>> {
  const publicacao = podePublicar(usuario);
  if (!publicacao.ok) return publicacao;

  const limite = await dentroDoLimite(usuario.id, "pergunta");
  if (!limite.ok) return limite;

  const titulo = input.titulo.trim();
  const corpo = input.corpo.trim();
  const objetivo = input.objetivo.trim();
  if (titulo.length < 12 || titulo.length > 140) {
    return { ok: false, erro: "O título precisa ter entre 12 e 140 caracteres." };
  }
  if (corpo.length < 20 || corpo.length > 5000) {
    return { ok: false, erro: "Conte a dúvida com um pouco mais de contexto." };
  }
  if (objetivo.length < 2 || objetivo.length > 120) {
    return { ok: false, erro: "Diga o objetivo desta pergunta." };
  }
  if (!(DIFICULDADES as readonly string[]).includes(input.dificuldade)) {
    return { ok: false, erro: "Escolha a dificuldade." };
  }
  if (!(NIVEIS as readonly string[]).includes(input.nivelEducacional)) {
    return { ok: false, erro: "Escolha o nível educacional." };
  }
  if (pareceFraudeAcademica(`${titulo}\n${corpo}`)) {
    return { ok: false, erro: MENSAGEM_FRAUDE };
  }

  const noIds = [...new Set(input.noIds.filter(Boolean))];
  if (noIds.length === 0) return { ok: false, erro: "Escolha o assunto no mapa de conhecimento." };
  const existentes = await db.noConhecimento.count({ where: { id: { in: noIds } } });
  if (existentes !== noIds.length) return { ok: false, erro: "Um dos assuntos escolhidos não existe." };

  const recentes = await db.pergunta.findMany({
    where: { oculto: false },
    select: { titulo: true },
    orderBy: { criadaEm: "desc" },
    take: 300,
  });
  if (recentes.some((item) => normalizarBusca(item.titulo) === normalizarBusca(titulo))) {
    return { ok: false, erro: "Já existe uma pergunta com este título. Abra a existente em vez de repetir." };
  }

  const criada = await db.$transaction(async (tx) => {
    const pergunta = await tx.pergunta.create({
      data: {
        titulo,
        corpo,
        dificuldade: input.dificuldade,
        nivelEducacional: input.nivelEducacional,
        objetivo,
        autorId: usuario.id,
        nos: { create: noIds.map((noId) => ({ noId })) },
      },
    });
    await somarReputacao(
      tx,
      usuario.id,
      { contribuicao: 1 },
      "pergunta_criada",
      "Publicou uma pergunta classificada.",
    );
    return pergunta;
  });

  return { ok: true, id: criada.id };
}
