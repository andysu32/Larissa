export const ROTULO_ESTADO: Record<string, string> = {
  nao_verificada: "Não verificada",
  em_analise: "Em análise",
  revisao_humana: "Revisão humana",
  parcialmente_correta: "Parcialmente correta",
  correta: "Correta",
  verificada_especialista: "Verificada por especialista",
  incorreta: "Incorreta",
};

export const AJUDA_ESTADO: Record<string, string> = {
  nao_verificada: "Ainda não passou por revisão.",
  em_analise: "A fila de revisão está olhando esta resposta.",
  revisao_humana: "A revisão automática não confirma. Uma pessoa precisa analisar.",
  parcialmente_correta: "Há um acerto parcial, com ressalvas explicadas.",
  correta: "Uma pessoa autorizada considerou a resposta correta e registrou o motivo.",
  verificada_especialista: "Um especialista desta área verificou a resposta.",
  incorreta: "Uma pessoa autorizada marcou a resposta como incorreta e registrou o motivo.",
};

export const ROTULO_DIFICULDADE: Record<string, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

export const ROTULO_NIVEL: Record<string, string> = {
  fundamental: "Ensino fundamental",
  medio: "Ensino médio",
  vestibular: "Vestibular",
  graduacao: "Graduação",
  pos: "Pós-graduação",
  livre: "Estudo livre",
};

export const DIFICULDADES = ["facil", "medio", "dificil"] as const;
export const NIVEIS = ["fundamental", "medio", "vestibular", "graduacao", "pos", "livre"] as const;
