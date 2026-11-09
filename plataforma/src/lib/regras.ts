export const ESTADOS = [
  "nao_verificada",
  "em_analise",
  "revisao_humana",
  "parcialmente_correta",
  "correta",
  "verificada_especialista",
  "incorreta",
] as const;

export type Estado = (typeof ESTADOS)[number];

export const PRECISAO_CONTRIBUIDOR = 30;

const PESO: Record<Estado, number> = {
  nao_verificada: 0,
  em_analise: 0,
  revisao_humana: 0,
  parcialmente_correta: 4,
  correta: 12,
  verificada_especialista: 14,
  incorreta: -10,
};

const FECHADOS = new Set<Estado>([
  "parcialmente_correta",
  "correta",
  "incorreta",
  "verificada_especialista",
]);

export type PapelEscopo = { papel: string; areaId: string | null };

export function idadeEm(nascimento: Date, hoje: Date): number {
  let idade = hoje.getUTCFullYear() - nascimento.getUTCFullYear();
  const mes = hoje.getUTCMonth() - nascimento.getUTCMonth();
  if (mes < 0 || (mes === 0 && hoje.getUTCDate() < nascimento.getUTCDate())) {
    idade -= 1;
  }
  return idade;
}

export function faixaCadastro(idade: number): "recusado" | "restrito" | "pleno" {
  if (!Number.isFinite(idade) || idade < 13 || idade > 120) return "recusado";
  if (idade < 16) return "restrito";
  return "pleno";
}

export function ehEstado(valor: string): valor is Estado {
  return (ESTADOS as readonly string[]).includes(valor);
}

export function iaPodeDefinirEstado(estado: Estado): boolean {
  return estado === "em_analise" || estado === "revisao_humana";
}

export function votoNaoDecideCorrecao(): true {
  return true;
}

export function deltaPrecisao(anterior: Estado, novo: Estado): number {
  return PESO[novo] - PESO[anterior];
}

export function deltaContribuicaoVeredito(anterior: Estado, novo: Estado): number {
  const positivo = (estado: Estado) =>
    estado === "correta" || estado === "verificada_especialista";
  if (positivo(novo) === positivo(anterior)) return 0;
  return positivo(novo) ? 2 : -2;
}

export function deltaClareza(votoAnterior: number | null, votoNovo: number): number {
  const era = votoAnterior === 1 ? 1 : 0;
  const fica = votoNovo === 1 ? 1 : 0;
  return fica - era;
}

export function ehModerador(papeis: { papel: string }[]): boolean {
  return papeis.some((papel) => papel.papel === "moderador" || papel.papel === "administrador");
}

export function ehAdministrador(papeis: { papel: string }[]): boolean {
  return papeis.some((papel) => papel.papel === "administrador");
}

export function podeMudarEstado(input: {
  atorId: string;
  autorRespostaId: string;
  estado: Estado;
  explicacao: string;
  precisao: number;
  papeis: PapelEscopo[];
  areasDaPergunta: string[];
}): { ok: true } | { ok: false; erro: string } {
  if (input.atorId === input.autorRespostaId) {
    return { ok: false, erro: "Quem escreveu a resposta não fecha o veredito dela." };
  }
  if (!ehEstado(input.estado)) {
    return { ok: false, erro: "Estado desconhecido." };
  }
  if (input.estado === "nao_verificada" || input.estado === "em_analise") {
    return { ok: false, erro: "Esse estado pertence à fila interna de revisão." };
  }

  const explicacao = input.explicacao.trim();
  if (FECHADOS.has(input.estado) && explicacao.length < 20) {
    return {
      ok: false,
      erro: "Explique em pelo menos uma frase por que a resposta está correta ou incorreta.",
    };
  }
  if (input.estado === "revisao_humana" && explicacao.length < 10) {
    return { ok: false, erro: "Diga por que a resposta voltou para revisão humana." };
  }

  const admin = ehAdministrador(input.papeis);
  const moderador = admin || ehModerador(input.papeis);
  const especialistaNaArea = input.papeis.some(
    (papel) =>
      papel.papel === "especialista" &&
      papel.areaId !== null &&
      input.areasDaPergunta.includes(papel.areaId),
  );
  const contribuidor = input.precisao >= PRECISAO_CONTRIBUIDOR || moderador;

  if (input.estado === "verificada_especialista") {
    if (!especialistaNaArea) {
      return {
        ok: false,
        erro: "Só um especialista desta área pode marcar verificação de especialista.",
      };
    }
    return { ok: true };
  }

  if (input.estado === "parcialmente_correta") {
    if (!contribuidor) {
      return {
        ok: false,
        erro: "Propor correção parcial exige precisão reconhecida ou moderação.",
      };
    }
    return { ok: true };
  }

  if (
    input.estado === "correta" ||
    input.estado === "incorreta" ||
    input.estado === "revisao_humana"
  ) {
    if (!moderador) {
      return { ok: false, erro: "Esse veredito precisa de moderação. Votos não bastam." };
    }
    return { ok: true };
  }

  return { ok: false, erro: "Não foi possível alterar o estado." };
}

export function estadosDisponiveis(
  input: Omit<Parameters<typeof podeMudarEstado>[0], "estado" | "explicacao">,
): Estado[] {
  return ESTADOS.filter(
    (estado) => podeMudarEstado({ ...input, estado, explicacao: "x".repeat(40) }).ok,
  );
}
