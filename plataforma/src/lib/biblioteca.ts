import { db } from "./db";
import { idsDaSubarvore } from "./arvore";

export const ROTULO_ACESSO: Record<string, string> = {
  gratuito: "Gratuito, com link oficial",
  dominio_publico: "Domínio público",
  comercial: "Comercial, sem arquivo",
};

export type LivroLista = {
  slug: string;
  titulo: string;
  autores: string;
  descricao: string;
  nivel: string;
  edicao: string;
  tipoAcesso: string;
  ondeObter: string;
  direitoUso: string;
  assunto: string | null;
  assuntoSlug: string | null;
};

export async function listarLivros(filtro?: { assunto?: string; acesso?: string }): Promise<LivroLista[]> {
  const ids = filtro?.assunto ? await idsDaSubarvore(filtro.assunto) : null;
  if (filtro?.assunto && !ids) return [];
  const acessos = ["gratuito", "dominio_publico", "comercial"];
  const acesso = filtro?.acesso && acessos.includes(filtro.acesso) ? filtro.acesso : undefined;

  const livros = await db.livro.findMany({
    where: {
      ...(ids ? { noId: { in: ids } } : {}),
      ...(acesso ? { tipoAcesso: acesso } : {}),
    },
    include: { no: true },
    orderBy: { titulo: "asc" },
  });

  return livros.map(apresentar);
}

export async function obterLivro(slug: string): Promise<LivroLista | null> {
  const livro = await db.livro.findUnique({ where: { slug }, include: { no: true } });
  return livro ? apresentar(livro) : null;
}

function apresentar(livro: {
  slug: string;
  titulo: string;
  autores: string;
  descricao: string;
  nivel: string;
  edicao: string;
  tipoAcesso: string;
  ondeObter: string;
  direitoUso: string;
  no: { nome: string; slug: string } | null;
}): LivroLista {
  return {
    slug: livro.slug,
    titulo: livro.titulo,
    autores: livro.autores,
    descricao: livro.descricao,
    nivel: livro.nivel,
    edicao: livro.edicao,
    tipoAcesso: livro.tipoAcesso,
    ondeObter: livro.ondeObter,
    direitoUso: livro.direitoUso,
    assunto: livro.no?.nome ?? null,
    assuntoSlug: livro.no?.slug ?? null,
  };
}
