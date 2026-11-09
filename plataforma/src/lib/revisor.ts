import { db } from "./db";

export async function pedirParecer(respostaId: string): Promise<void> {
  await db.job.create({
    data: { tipo: "parecer", payload: respostaId, status: "concluido" },
  });
  await db.parecerIa.create({
    data: {
      respostaId,
      confianca: "baixa",
      texto: "A revisão automática não confirma correção e não classifica a resposta como certa. Uma pessoa precisa analisar.",
    },
  });
  await db.resposta.update({
    where: { id: respostaId },
    data: { estado: "revisao_humana" },
  });
}
