import { db } from "./db";
import { podePublicar } from "./guardas";
import { dentroDoLimite } from "./limites";
import { apresentarAutor, MENSAGEM_FRAUDE, pareceFraudeAcademica } from "./texto";
import type { Resultado, UsuarioAtual } from "./tipos";

const ETIQUETAS = new Set(["discussao", "material", "pergunta"]);

export type ComunidadeLista = {
  slug: string;
  nome: string;
  descricao: string;
  membros: number;
  publicacoes: number;
};

export async function listarComunidades(): Promise<ComunidadeLista[]> {
  const lista = await db.comunidade.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { membros: true, publicacoes: true } } },
  });
  return lista.map((comunidade) => ({
    slug: comunidade.slug,
    nome: comunidade.nome,
    descricao: comunidade.descricao,
    membros: comunidade._count.membros,
    publicacoes: comunidade._count.publicacoes,
  }));
}

export async function obterComunidade(slug: string, usuarioId: string | null) {
  const comunidade = await db.comunidade.findUnique({
    where: { slug },
    include: {
      membros: { select: { usuarioId: true } },
      publicacoes: {
        where: { oculto: false },
        orderBy: { criadaEm: "desc" },
        include: {
          autor: { include: { perfil: true } },
          comentarios: {
            where: { oculto: false },
            orderBy: { criadoEm: "asc" },
            include: { autor: { include: { perfil: true } } },
          },
          enquete: {
            include: {
              opcoes: { include: { _count: { select: { votos: true } } } },
              votos: { select: { usuarioId: true, opcaoId: true } },
            },
          },
        },
      },
    },
  });
  if (!comunidade) return null;

  return {
    slug: comunidade.slug,
    nome: comunidade.nome,
    descricao: comunidade.descricao,
    regras: comunidade.regras,
    souMembro: usuarioId ? comunidade.membros.some((membro) => membro.usuarioId === usuarioId) : false,
    publicacoes: comunidade.publicacoes.map((publicacao) => ({
      id: publicacao.id,
      titulo: publicacao.titulo,
      corpo: publicacao.corpo,
      etiqueta: publicacao.etiqueta,
      criadaEm: publicacao.criadaEm,
      autor: apresentarAutor(publicacao.autor),
      autorId: publicacao.autorId,
      comentarios: publicacao.comentarios.map((comentario) => ({
        id: comentario.id,
        corpo: comentario.corpo,
        criadaEm: comentario.criadoEm,
        autor: apresentarAutor(comentario.autor),
      })),
      enquete: publicacao.enquete
        ? {
            id: publicacao.enquete.id,
            opcoes: publicacao.enquete.opcoes.map((opcao) => ({
              id: opcao.id,
              texto: opcao.texto,
              votos: opcao._count.votos,
            })),
            minhaOpcaoId: usuarioId
              ? (publicacao.enquete.votos.find((voto) => voto.usuarioId === usuarioId)?.opcaoId ?? null)
              : null,
          }
        : null,
    })),
  };
}

async function exigirMembro(usuarioId: string, slug: string) {
  const comunidade = await db.comunidade.findUnique({
    where: { slug },
    include: { membros: { where: { usuarioId }, select: { usuarioId: true } } },
  });
  if (!comunidade) return { ok: false as const, erro: "Não encontramos a comunidade." };
  if (comunidade.membros.length === 0) {
    return { ok: false as const, erro: "Entre na comunidade para participar." };
  }
  return { ok: true as const, comunidade };
}

export async function entrarComunidade(usuario: UsuarioAtual, slug: string): Promise<Resultado> {
  if (usuario.bloqueado) {
    return { ok: false, erro: "Esta conta está bloqueada para participar." };
  }
  const comunidade = await db.comunidade.findUnique({ where: { slug } });
  if (!comunidade) return { ok: false, erro: "Não encontramos a comunidade." };
  await db.membroComunidade.upsert({
    where: { usuarioId_comunidadeId: { usuarioId: usuario.id, comunidadeId: comunidade.id } },
    update: {},
    create: { usuarioId: usuario.id, comunidadeId: comunidade.id },
  });
  return { ok: true };
}

export async function criarPublicacao(
  usuario: UsuarioAtual,
  input: { slug: string; titulo: string; corpo: string; etiqueta: string },
): Promise<Resultado<{ id: string }>> {
  const publicacao = podePublicar(usuario);
  if (!publicacao.ok) return publicacao;
  const limite = await dentroDoLimite(usuario.id, "publicacao");
  if (!limite.ok) return limite;
  const membro = await exigirMembro(usuario.id, input.slug);
  if (!membro.ok) return membro;

  const titulo = input.titulo.trim();
  const corpo = input.corpo.trim();
  if (!ETIQUETAS.has(input.etiqueta)) return { ok: false, erro: "Escolha o tipo da publicação." };
  if (titulo.length < 8 || titulo.length > 140) return { ok: false, erro: "O título precisa ter entre 8 e 140 caracteres." };
  if (corpo.length < 10 || corpo.length > 5000) return { ok: false, erro: "Escreva a publicação com um pouco mais de conteúdo." };
  if (pareceFraudeAcademica(`${titulo}\n${corpo}`)) return { ok: false, erro: MENSAGEM_FRAUDE };

  const criada = await db.publicacao.create({
    data: {
      titulo,
      corpo,
      etiqueta: input.etiqueta,
      comunidadeId: membro.comunidade.id,
      autorId: usuario.id,
    },
  });
  return { ok: true, id: criada.id };
}

export async function criarEnquete(
  usuario: UsuarioAtual,
  input: { slug: string; titulo: string; corpo: string; opcoes: string[] },
): Promise<Resultado<{ id: string }>> {
  const publicacao = podePublicar(usuario);
  if (!publicacao.ok) return publicacao;
  const limite = await dentroDoLimite(usuario.id, "publicacao");
  if (!limite.ok) return limite;
  const membro = await exigirMembro(usuario.id, input.slug);
  if (!membro.ok) return membro;

  const titulo = input.titulo.trim();
  const corpo = input.corpo.trim();
  const opcoes = [...new Set(input.opcoes.map((opcao) => opcao.trim()).filter(Boolean))];
  if (titulo.length < 8 || titulo.length > 140) return { ok: false, erro: "O título da enquete precisa ter entre 8 e 140 caracteres." };
  if (corpo.length > 2000) return { ok: false, erro: "O texto da enquete está longo demais." };
  if (opcoes.length < 2 || opcoes.length > 6) return { ok: false, erro: "A enquete precisa de 2 a 6 opções." };
  if (opcoes.some((opcao) => opcao.length > 80)) return { ok: false, erro: "Cada opção pode ter até 80 caracteres." };

  const criada = await db.publicacao.create({
    data: {
      titulo,
      corpo: corpo || "Enquete da comunidade.",
      etiqueta: "enquete",
      comunidadeId: membro.comunidade.id,
      autorId: usuario.id,
      enquete: { create: { opcoes: { create: opcoes.map((texto) => ({ texto })) } } },
    },
  });
  return { ok: true, id: criada.id };
}

export async function comentar(
  usuario: UsuarioAtual,
  input: { publicacaoId: string; corpo: string },
): Promise<Resultado> {
  const publicacaoPermitida = podePublicar(usuario);
  if (!publicacaoPermitida.ok) return publicacaoPermitida;
  const limite = await dentroDoLimite(usuario.id, "comentario");
  if (!limite.ok) return limite;
  const corpo = input.corpo.trim();
  if (corpo.length < 2 || corpo.length > 2000) return { ok: false, erro: "Escreva um comentário curto e claro." };
  if (pareceFraudeAcademica(corpo)) return { ok: false, erro: MENSAGEM_FRAUDE };

  const publicacao = await db.publicacao.findUnique({
    where: { id: input.publicacaoId },
    include: { comunidade: true },
  });
  if (!publicacao || publicacao.oculto) return { ok: false, erro: "Não encontramos a publicação." };
  const membro = await db.membroComunidade.findUnique({
    where: {
      usuarioId_comunidadeId: { usuarioId: usuario.id, comunidadeId: publicacao.comunidadeId },
    },
  });
  if (!membro) return { ok: false, erro: "Entre na comunidade para comentar." };

  await db.comentario.create({
    data: { corpo, publicacaoId: publicacao.id, autorId: usuario.id },
  });
  return { ok: true };
}

export async function votarEnquete(
  usuario: UsuarioAtual,
  input: { enqueteId: string; opcaoId: string },
): Promise<Resultado> {
  if (usuario.bloqueado) return { ok: false, erro: "Esta conta está bloqueada." };
  const enquete = await db.enquete.findUnique({
    where: { id: input.enqueteId },
    include: { opcoes: true, publicacao: true },
  });
  if (!enquete || enquete.publicacao.oculto) return { ok: false, erro: "Não encontramos a enquete." };
  if (!enquete.opcoes.some((opcao) => opcao.id === input.opcaoId)) {
    return { ok: false, erro: "Essa opção não pertence à enquete." };
  }
  const membro = await db.membroComunidade.findUnique({
    where: {
      usuarioId_comunidadeId: {
        usuarioId: usuario.id,
        comunidadeId: enquete.publicacao.comunidadeId,
      },
    },
  });
  if (!membro) return { ok: false, erro: "Entre na comunidade para votar." };

  await db.votoEnquete.upsert({
    where: { usuarioId_enqueteId: { usuarioId: usuario.id, enqueteId: enquete.id } },
    create: { usuarioId: usuario.id, enqueteId: enquete.id, opcaoId: input.opcaoId },
    update: { opcaoId: input.opcaoId },
  });
  return { ok: true };
}
