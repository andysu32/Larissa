import { db } from "./db";
import { idsComAncestrais } from "./arvore";
import { somarReputacao } from "./reputacao";
import { ROTULO_ESTADO } from "./rotulos";
import {
  deltaContribuicaoVeredito,
  deltaPrecisao,
  ehEstado,
  estadosDisponiveis,
  podeMudarEstado,
  type Estado,
} from "./regras";
import type { Resultado, UsuarioAtual } from "./tipos";

export async function opcoesParaResposta(usuario: UsuarioAtual, respostaId: string): Promise<Estado[]> {
  const resposta = await db.resposta.findUnique({
    where: { id: respostaId },
    include: { pergunta: { include: { nos: true } } },
  });
  if (!resposta) return [];
  const areasDaPergunta = await idsComAncestrais(resposta.pergunta.nos.map((item) => item.noId));
  return estadosDisponiveis({
    atorId: usuario.id,
    autorRespostaId: resposta.autorId,
    precisao: usuario.precisao,
    papeis: usuario.papeis,
    areasDaPergunta,
  });
}

export async function aplicarVeredito(
  usuario: UsuarioAtual,
  input: { respostaId: string; estado: string; explicacao: string },
): Promise<Resultado> {
  if (!ehEstado(input.estado)) return { ok: false, erro: "Estado desconhecido." };
  const resposta = await db.resposta.findUnique({
    where: { id: input.respostaId },
    include: { pergunta: { include: { nos: true } } },
  });
  if (!resposta) return { ok: false, erro: "Não encontramos a resposta." };
  if (!ehEstado(resposta.estado)) return { ok: false, erro: "A resposta está com um estado inválido." };
  const estadoAtual: Estado = resposta.estado;
  const novo: Estado = input.estado;

  const areasDaPergunta = await idsComAncestrais(resposta.pergunta.nos.map((item) => item.noId));
  const permissao = podeMudarEstado({
    atorId: usuario.id,
    autorRespostaId: resposta.autorId,
    estado: novo,
    explicacao: input.explicacao,
    precisao: usuario.precisao,
    papeis: usuario.papeis,
    areasDaPergunta,
  });
  if (!permissao.ok) return permissao;
  await db.$transaction(async (tx) => {
    await tx.resposta.update({
      where: { id: resposta.id },
      data: {
        estado: novo,
        explicacaoVeredito: input.explicacao.trim(),
        vereditoPorId: usuario.id,
      },
    });
    await somarReputacao(
      tx,
      resposta.autorId,
      {
        precisao: deltaPrecisao(estadoAtual, novo),
        contribuicao: deltaContribuicaoVeredito(estadoAtual, novo),
      },
      "veredito",
      `Veredito registrado: ${ROTULO_ESTADO[novo]}.`,
    );
    await tx.revisaoConteudo.create({
      data: {
        alvoTipo: "resposta",
        alvoId: resposta.id,
        editorId: usuario.id,
        resumo: `Veredito: ${ROTULO_ESTADO[novo]}.`,
      },
    });
  });

  return { ok: true };
}
