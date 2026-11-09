import { db } from "./db";

export async function idsComAncestrais(noIds: string[]): Promise<string[]> {
  const todos = await db.noConhecimento.findMany({ select: { id: true, paiId: true } });
  const pais = new Map(todos.map((no) => [no.id, no.paiId]));
  const saida = new Set<string>();

  for (const inicio of noIds) {
    let atual: string | null | undefined = inicio;
    const visto = new Set<string>();
    while (atual && !visto.has(atual)) {
      visto.add(atual);
      saida.add(atual);
      atual = pais.get(atual) ?? null;
    }
  }

  return [...saida];
}

export type NoSelecao = { id: string; nome: string; tipo: string; trilha: string };

export async function nosParaSelecao(): Promise<NoSelecao[]> {
  const nos = await db.noConhecimento.findMany();
  const porId = new Map(nos.map((no) => [no.id, no]));
  return nos
    .map((no) => {
      const nomes: string[] = [];
      let atual: (typeof nos)[number] | undefined = no;
      const visto = new Set<string>();
      while (atual && !visto.has(atual.id)) {
        visto.add(atual.id);
        nomes.push(atual.nome);
        atual = atual.paiId ? porId.get(atual.paiId) : undefined;
      }
      return {
        id: no.id,
        nome: no.nome,
        tipo: no.tipo,
        trilha: nomes.reverse().join(" → "),
      };
    })
    .sort((a, b) => a.trilha.localeCompare(b.trilha, "pt-BR"));
}

export type NoArvore = {
  id: string;
  nome: string;
  slug: string;
  tipo: string;
  requisitos: string[];
  filhos: NoArvore[];
};

export async function arvoreConhecimento(): Promise<NoArvore[]> {
  const nos = await db.noConhecimento.findMany({
    include: { requisitos: { include: { requisito: true } } },
  });
  const porPai = new Map<string | null, typeof nos>();
  for (const no of nos) {
    const lista = porPai.get(no.paiId) ?? [];
    lista.push(no);
    porPai.set(no.paiId, lista);
  }

  const montar = (paiId: string | null): NoArvore[] =>
    (porPai.get(paiId) ?? [])
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
      .map((no) => ({
        id: no.id,
        nome: no.nome,
        slug: no.slug,
        tipo: no.tipo,
        requisitos: no.requisitos.map((item) => item.requisito.nome),
        filhos: montar(no.id),
      }));

  return montar(null);
}

export async function idsDaSubarvore(slug: string): Promise<string[] | null> {
  const nos = await db.noConhecimento.findMany({ select: { id: true, slug: true, paiId: true } });
  const alvo = nos.find((no) => no.slug === slug);
  if (!alvo) return null;

  const filhos = new Map<string, string[]>();
  for (const no of nos) {
    if (!no.paiId) continue;
    const lista = filhos.get(no.paiId) ?? [];
    lista.push(no.id);
    filhos.set(no.paiId, lista);
  }

  const ids = new Set<string>();
  const pilha = [alvo.id];
  while (pilha.length > 0) {
    const atual = pilha.pop();
    if (!atual || ids.has(atual)) continue;
    ids.add(atual);
    for (const filho of filhos.get(atual) ?? []) pilha.push(filho);
  }
  return [...ids];
}
