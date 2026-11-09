import { db } from "./db";

export async function resumoProgresso(usuarioId: string) {
  const [perguntas, respostas, verificadas, objetivo, ligacoes] = await Promise.all([
    db.pergunta.count({ where: { autorId: usuarioId, oculto: false } }),
    db.resposta.count({ where: { autorId: usuarioId, oculto: false } }),
    db.resposta.count({
      where: {
        autorId: usuarioId,
        oculto: false,
        estado: { in: ["correta", "verificada_especialista"] },
      },
    }),
    db.objetivoEstudo.findUnique({ where: { usuarioId } }),
    db.perguntaNo.findMany({
      where: { pergunta: { autorId: usuarioId, oculto: false } },
      include: { no: true },
    }),
  ]);

  const assuntos = [...new Map(ligacoes.map((item) => [item.noId, item.no.nome])).values()];
  return {
    perguntas,
    respostas,
    verificadas,
    assuntos,
    objetivo: objetivo
      ? {
          descricao: objetivo.descricao,
          nivel: objetivo.nivel,
          prova: objetivo.prova,
          minutosPorDia: objetivo.minutosPorDia,
          dificuldades: objetivo.dificuldades,
        }
      : null,
  };
}
