export function normalizarBusca(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function nomeVisivel(pessoa: {
  nome: string;
  apelido: string;
  restrito?: boolean;
  mostrarNome?: boolean;
}): string {
  if (pessoa.restrito || !pessoa.mostrarNome) return pessoa.apelido;
  return pessoa.nome;
}

export function fonteDe(valor: string | null | undefined): "sm" | "md" | "lg" {
  if (valor === "sm" || valor === "lg") return valor;
  return "md";
}

export function pareceFraudeAcademica(texto: string): boolean {
  return /fa[cç]a\s+(a\s+)?minha\s+(prova|atividade|tarefa|reda[cç][aã]o)|responde\s+por\s+mim\s+(a|essa)\s+prova|quero\s+cola\s+pronta/i.test(
    texto,
  );
}

export function urlOpcionalValida(url: string): boolean {
  if (!url.trim()) return true;
  try {
    const endereco = new URL(url);
    return endereco.protocol === "http:" || endereco.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeZone: "America/Sao_Paulo",
  }).format(data);
}

export const MENSAGEM_FRAUDE =
  "A plataforma ajuda a entender o conteúdo. Pedidos para fazer uma prova ou tarefa no seu lugar não são publicados.";

export function apresentarAutor(autor: {
  nome: string;
  apelido: string;
  restrito: boolean;
  perfil: { mostrarNome: boolean } | null;
}): string {
  return nomeVisivel({
    nome: autor.nome,
    apelido: autor.apelido,
    restrito: autor.restrito,
    mostrarNome: autor.perfil?.mostrarNome ?? false,
  });
}
