import { db } from "./db";
import { nomeVisivel, normalizarBusca } from "./texto";

const PESO_ESTADO: Record<string, number> = {
  verificada_especialista: 0,
  correta: 1,
  parcialmente_correta: 2,
  revisao_humana: 3,
  em_analise: 4,
  nao_verificada: 5,
  incorreta: 6,
};

export type ResultadoBusca = {
  termo: string;
  aviso: string | null;
  perguntas: { id: string; titulo: string; trecho: string }[];
  respostas: { id: string; perguntaId: string; trecho: string; estado: string; perguntaTitulo: string }[];
  comunidades: { slug: string; nome: string; descricao: string }[];
  pessoas: { id: string; nomeVisivel: string; precisao: number | null }[];
  nos: { slug: string; nome: string; tipo: string }[];
  livros: { slug: string; titulo: string; autores: string; tipoAcesso: string }[];
};

function termosDe(termo: string): string[] {
  return normalizarBusca(termo)
    .split(" ")
    .filter((parte) => parte.length >= 2);
}

function contem(texto: string, termos: string[]): boolean {
  const base = normalizarBusca(texto);
  return termos.every((termo) => base.includes(termo));
}

function trecho(texto: string): string {
  const limpo = texto.replace(/\s+/g, " ").trim();
  return limpo.length > 180 ? `${limpo.slice(0, 177)}…` : limpo;
}

export async function buscar(termo: string): Promise<ResultadoBusca> {
  const termos = termosDe(termo);
  if (termos.length === 0) {
    return {
      termo,
      aviso: "Escreva pelo menos duas letras.",
      perguntas: [],
      respostas: [],
      comunidades: [],
      pessoas: [],
      nos: [],
      livros: [],
    };
  }

  const [perguntas, respostas, comunidades, pessoas, nos, livros] = await Promise.all([
    db.pergunta.findMany({
      where: { oculto: false },
      orderBy: { criadaEm: "desc" },
      take: 300,
      select: { id: true, titulo: true, corpo: true },
    }),
    db.resposta.findMany({
      where: { oculto: false, pergunta: { oculto: false } },
      orderBy: { criadaEm: "desc" },
      take: 300,
      select: { id: true, corpo: true, estado: true, perguntaId: true, pergunta: { select: { titulo: true } } },
    }),
    db.comunidade.findMany({ select: { slug: true, nome: true, descricao: true } }),
    db.usuario.findMany({
      take: 200,
      include: { perfil: true, reputacao: true },
    }),
    db.noConhecimento.findMany({ select: { slug: true, nome: true, tipo: true } }),
    db.livro.findMany({
      select: { slug: true, titulo: true, autores: true, descricao: true, tipoAcesso: true },
    }),
  ]);

  return {
    termo,
    aviso: null,
    perguntas: perguntas
      .filter((item) => contem(`${item.titulo} ${item.corpo}`, termos))
      .slice(0, 20)
      .map((item) => ({ id: item.id, titulo: item.titulo, trecho: trecho(item.corpo) })),
    respostas: respostas
      .filter((item) => contem(`${item.pergunta.titulo} ${item.corpo}`, termos))
      .sort((a, b) => (PESO_ESTADO[a.estado] ?? 9) - (PESO_ESTADO[b.estado] ?? 9))
      .slice(0, 20)
      .map((item) => ({
        id: item.id,
        perguntaId: item.perguntaId,
        trecho: trecho(item.corpo),
        estado: item.estado,
        perguntaTitulo: item.pergunta.titulo,
      })),
    comunidades: comunidades
      .filter((item) => contem(`${item.nome} ${item.descricao}`, termos))
      .slice(0, 20),
    pessoas: pessoas
      .filter((pessoa) => {
        const nomePublico = !pessoa.restrito && pessoa.perfil?.mostrarNome;
        return contem(pessoa.apelido, termos) || (nomePublico && contem(pessoa.nome, termos));
      })
      .slice(0, 20)
      .map((pessoa) => ({
        id: pessoa.id,
        nomeVisivel: nomeVisivel({
          nome: pessoa.nome,
          apelido: pessoa.apelido,
          restrito: pessoa.restrito,
          mostrarNome: pessoa.perfil?.mostrarNome ?? false,
        }),
        precisao:
          !pessoa.restrito && pessoa.perfil?.mostrarReputacao !== false
            ? (pessoa.reputacao?.precisao ?? 0)
            : null,
      })),
    nos: nos.filter((item) => contem(item.nome, termos)).slice(0, 20),
    livros: livros
      .filter((item) => contem(`${item.titulo} ${item.autores} ${item.descricao}`, termos))
      .slice(0, 20)
      .map((item) => ({
        slug: item.slug,
        titulo: item.titulo,
        autores: item.autores,
        tipoAcesso: item.tipoAcesso,
      })),
  };
}
