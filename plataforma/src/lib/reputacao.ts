import type { Prisma } from "@prisma/client";
import { db } from "./db";

type Transacao = Prisma.TransactionClient;

export async function somarReputacao(
  tx: Transacao,
  usuarioId: string,
  delta: { precisao?: number; clareza?: number; contribuicao?: number },
  tipo: string,
  detalhe: string,
): Promise<void> {
  const precisao = delta.precisao ?? 0;
  const clareza = delta.clareza ?? 0;
  const contribuicao = delta.contribuicao ?? 0;
  if (precisao === 0 && clareza === 0 && contribuicao === 0) return;

  await tx.reputacao.upsert({
    where: { usuarioId },
    create: { usuarioId, precisao, clareza, contribuicao },
    update: {
      precisao: { increment: precisao },
      clareza: { increment: clareza },
      contribuicao: { increment: contribuicao },
    },
  });
  await tx.eventoReputacao.create({
    data: {
      usuarioId,
      tipo,
      detalhe,
      deltaPrecisao: precisao,
      deltaClareza: clareza,
      deltaContribuicao: contribuicao,
    },
  });
}

export async function eventosRecentes(usuarioId: string) {
  return db.eventoReputacao.findMany({
    where: { usuarioId },
    orderBy: { criadoEm: "desc" },
    take: 8,
  });
}
