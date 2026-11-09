import { db } from "./db";
import type { Resultado } from "./tipos";

const TETO = {
  pergunta: 8,
  resposta: 20,
  voto: 40,
  denuncia: 8,
  publicacao: 12,
  comentario: 30,
} as const;

export type TipoLimite = keyof typeof TETO;

export async function dentroDoLimite(usuarioId: string, tipo: TipoLimite): Promise<Resultado> {
  const desde = new Date(Date.now() - 60 * 60 * 1000);
  let total = 0;
  if (tipo === "pergunta") {
    total = await db.pergunta.count({ where: { autorId: usuarioId, criadaEm: { gte: desde } } });
  } else if (tipo === "resposta") {
    total = await db.resposta.count({ where: { autorId: usuarioId, criadaEm: { gte: desde } } });
  } else if (tipo === "voto") {
    total = await db.voto.count({ where: { usuarioId, criadoEm: { gte: desde } } });
  } else if (tipo === "denuncia") {
    total = await db.denuncia.count({ where: { autorId: usuarioId, criadaEm: { gte: desde } } });
  } else if (tipo === "publicacao") {
    total = await db.publicacao.count({ where: { autorId: usuarioId, criadaEm: { gte: desde } } });
  } else {
    total = await db.comentario.count({ where: { autorId: usuarioId, criadoEm: { gte: desde } } });
  }

  if (total >= TETO[tipo]) {
    return {
      ok: false,
      erro: "Você chegou ao limite desta hora. O limite existe para conter spam, não para travar o estudo.",
    };
  }
  return { ok: true };
}
