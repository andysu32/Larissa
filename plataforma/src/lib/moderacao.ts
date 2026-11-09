import { db } from "./db";
import { ehAdministrador, ehModerador } from "./regras";
import { dentroDoLimite } from "./limites";
import type { Resultado, UsuarioAtual } from "./tipos";

export const MOTIVOS_DENUNCIA = [
  { id: "spam", rotulo: "Spam" },
  { id: "plagio", rotulo: "Plágio" },
  { id: "informacao_falsa", rotulo: "Informação falsa" },
  { id: "assedio", rotulo: "Assédio" },
  { id: "ofensivo", rotulo: "Conteúdo ofensivo" },
  { id: "fraude_academica", rotulo: "Fraude acadêmica" },
  { id: "direitos_autorais", rotulo: "Direitos autorais" },
  { id: "outro", rotulo: "Outro" },
] as const;

export const ACOES_MODERACAO = [
  { id: "ocultar", rotulo: "Ocultar" },
  { id: "restaurar", rotulo: "Restaurar" },
  { id: "avisar", rotulo: "Registrar aviso" },
  { id: "restringir", rotulo: "Restringir publicação" },
  { id: "bloquear", rotulo: "Bloquear conta" },
  { id: "arquivar", rotulo: "Arquivar denúncia" },
] as const;

const MOTIVOS = new Set<string>(MOTIVOS_DENUNCIA.map((item) => item.id));
const ACOES = new Set<string>(ACOES_MODERACAO.map((item) => item.id));

async function alvoExiste(tipo: string, id: string): Promise<boolean> {
  if (tipo === "pergunta") return Boolean(await db.pergunta.findUnique({ where: { id }, select: { id: true } }));
  if (tipo === "resposta") return Boolean(await db.resposta.findUnique({ where: { id }, select: { id: true } }));
  if (tipo === "publicacao") return Boolean(await db.publicacao.findUnique({ where: { id }, select: { id: true } }));
  if (tipo === "comentario") return Boolean(await db.comentario.findUnique({ where: { id }, select: { id: true } }));
  if (tipo === "usuario") return Boolean(await db.usuario.findUnique({ where: { id }, select: { id: true } }));
  return false;
}

async function autorIdDoAlvo(tipo: string, id: string): Promise<string | null> {
  if (tipo === "usuario") return id;
  if (tipo === "pergunta") return (await db.pergunta.findUnique({ where: { id }, select: { autorId: true } }))?.autorId ?? null;
  if (tipo === "resposta") return (await db.resposta.findUnique({ where: { id }, select: { autorId: true } }))?.autorId ?? null;
  if (tipo === "publicacao") return (await db.publicacao.findUnique({ where: { id }, select: { autorId: true } }))?.autorId ?? null;
  if (tipo === "comentario") return (await db.comentario.findUnique({ where: { id }, select: { autorId: true } }))?.autorId ?? null;
  return null;
}

async function definirOculto(tipo: string, id: string, oculto: boolean): Promise<void> {
  if (tipo === "pergunta") await db.pergunta.updateMany({ where: { id }, data: { oculto } });
  if (tipo === "resposta") await db.resposta.updateMany({ where: { id }, data: { oculto } });
  if (tipo === "publicacao") await db.publicacao.updateMany({ where: { id }, data: { oculto } });
  if (tipo === "comentario") await db.comentario.updateMany({ where: { id }, data: { oculto } });
}

export async function criarDenuncia(
  usuario: UsuarioAtual,
  input: { alvoTipo: string; alvoId: string; motivo: string; detalhe: string },
): Promise<Resultado> {
  if (usuario.bloqueado) return { ok: false, erro: "Esta conta está bloqueada." };
  const limite = await dentroDoLimite(usuario.id, "denuncia");
  if (!limite.ok) return limite;
  if (!MOTIVOS.has(input.motivo)) return { ok: false, erro: "Escolha o motivo da denúncia." };
  if (!(await alvoExiste(input.alvoTipo, input.alvoId))) {
    return { ok: false, erro: "Não encontramos o conteúdo denunciado." };
  }
  const detalhe = input.detalhe.trim();
  if (detalhe.length > 500) return { ok: false, erro: "A denúncia pode ter até 500 caracteres." };
  const aberta = await db.denuncia.findFirst({
    where: { autorId: usuario.id, alvoTipo: input.alvoTipo, alvoId: input.alvoId, status: "aberta" },
  });
  if (aberta) return { ok: false, erro: "Você já denunciou este conteúdo." };

  await db.denuncia.create({
    data: {
      autorId: usuario.id,
      alvoTipo: input.alvoTipo,
      alvoId: input.alvoId,
      motivo: input.motivo,
      detalhe,
    },
  });
  return { ok: true };
}

export async function listarFila(ator: UsuarioAtual) {
  if (!ehModerador(ator.papeis)) return { denuncias: [], apelacoes: [] };
  const [denuncias, apelacoes] = await Promise.all([
    db.denuncia.findMany({
      where: { status: "aberta" },
      orderBy: { criadaEm: "desc" },
      take: 50,
      include: { autor: { select: { apelido: true } } },
    }),
    db.apelacao.findMany({
      where: { status: "aberta" },
      orderBy: { criadaEm: "desc" },
      take: 50,
      include: {
        autor: { select: { apelido: true } },
        acao: { select: { id: true, motivo: true, acao: true, alvoTipo: true, alvoId: true, moderadorId: true } },
      },
    }),
  ]);

  return {
    denuncias: denuncias.map((denuncia) => ({
      id: denuncia.id,
      motivo: denuncia.motivo,
      detalhe: denuncia.detalhe,
      alvoTipo: denuncia.alvoTipo,
      alvoId: denuncia.alvoId,
      criadaEm: denuncia.criadaEm,
      autorApelido: denuncia.autor.apelido,
    })),
    apelacoes: apelacoes.map((apelacao) => ({
      id: apelacao.id,
      acaoId: apelacao.acao.id,
      texto: apelacao.texto,
      alvoTipo: apelacao.acao.alvoTipo,
      alvoId: apelacao.acao.alvoId,
      criadaEm: apelacao.criadaEm,
      autorApelido: apelacao.autor.apelido,
      acao: apelacao.acao.acao,
      acaoMotivo: apelacao.acao.motivo,
      moderadorId: apelacao.acao.moderadorId,
    })),
  };
}

export async function historicoDoAlvo(alvoTipo: string, alvoId: string) {
  const [revisoes, acoes] = await Promise.all([
    db.revisaoConteudo.findMany({
      where: { alvoTipo, alvoId },
      orderBy: { criadoEm: "desc" },
      take: 8,
      include: { editor: { select: { apelido: true } } },
    }),
    db.acaoModeracao.findMany({
      where: { alvoTipo, alvoId },
      orderBy: { criadoEm: "desc" },
      take: 8,
      include: { moderador: { select: { apelido: true } } },
    }),
  ]);
  return {
    revisoes: revisoes.map((item) => ({
      id: item.id,
      resumo: item.resumo,
      criadaEm: item.criadoEm,
      editor: item.editor.apelido,
    })),
    acoes: acoes.map((item) => ({
      id: item.id,
      acao: item.acao,
      motivo: item.motivo,
      criadaEm: item.criadoEm,
      moderador: item.moderador.apelido,
    })),
  };
}

export async function aplicarAcao(
  ator: UsuarioAtual,
  input: { denunciaId: string; alvoTipo: string; alvoId: string; acao: string; motivo: string },
): Promise<Resultado> {
  if (!ehModerador(ator.papeis)) return { ok: false, erro: "A moderação é restrita." };
  const motivo = input.motivo.trim();
  if (motivo.length < 10) return { ok: false, erro: "Registre o motivo da decisão." };
  if (!ACOES.has(input.acao)) return { ok: false, erro: "Ação desconhecida." };
  if (!(await alvoExiste(input.alvoTipo, input.alvoId))) {
    return { ok: false, erro: "Não encontramos o alvo." };
  }

  if (input.acao === "arquivar") {
    if (!input.denunciaId) return { ok: false, erro: "Escolha a denúncia que será arquivada." };
    await db.denuncia.updateMany({
      where: { id: input.denunciaId, status: "aberta" },
      data: { status: "improcedente" },
    });
  } else if (input.acao === "ocultar" || input.acao === "restaurar") {
    if (input.alvoTipo === "usuario") {
      return { ok: false, erro: "Para uma conta, use bloquear ou restringir." };
    }
    await definirOculto(input.alvoTipo, input.alvoId, input.acao === "ocultar");
    if (input.denunciaId) {
      await db.denuncia.updateMany({ where: { id: input.denunciaId }, data: { status: "procedente" } });
    }
  } else if (input.acao === "bloquear" || input.acao === "restringir") {
    const autorId = await autorIdDoAlvo(input.alvoTipo, input.alvoId);
    if (!autorId) return { ok: false, erro: "Não encontramos a conta afetada." };
    if (input.acao === "bloquear") {
      await db.usuario.update({ where: { id: autorId }, data: { bloqueado: true } });
    } else {
      await db.usuario.update({ where: { id: autorId }, data: { publicacaoRestrita: true } });
    }
    if (input.denunciaId) {
      await db.denuncia.updateMany({ where: { id: input.denunciaId }, data: { status: "procedente" } });
    }
  } else if (input.denunciaId) {
    await db.denuncia.updateMany({ where: { id: input.denunciaId }, data: { status: "procedente" } });
  }

  await db.acaoModeracao.create({
    data: {
      moderadorId: ator.id,
      denunciaId: input.denunciaId || null,
      alvoTipo: input.alvoTipo,
      alvoId: input.alvoId,
      acao: input.acao,
      motivo,
    },
  });
  return { ok: true };
}

async function reverterAcao(alvoTipo: string, alvoId: string, acao: string): Promise<void> {
  if (acao === "ocultar") await definirOculto(alvoTipo, alvoId, false);
  if (acao === "bloquear" || acao === "restringir") {
    const autorId = await autorIdDoAlvo(alvoTipo, alvoId);
    if (!autorId) return;
    if (acao === "bloquear") {
      await db.usuario.updateMany({ where: { id: autorId }, data: { bloqueado: false } });
    } else {
      await db.usuario.updateMany({ where: { id: autorId }, data: { publicacaoRestrita: false } });
    }
  }
}

export async function julgarApelacao(
  ator: UsuarioAtual,
  input: { apelacaoId: string; resultado: string; texto: string },
): Promise<Resultado> {
  if (!ehModerador(ator.papeis)) return { ok: false, erro: "A moderação é restrita." };
  if (input.resultado !== "procedente" && input.resultado !== "improcedente") {
    return { ok: false, erro: "Escolha se a apelação procede." };
  }
  const texto = input.texto.trim();
  if (texto.length < 10) return { ok: false, erro: "Explique a decisão da apelação." };

  const apelacao = await db.apelacao.findUnique({ where: { id: input.apelacaoId }, include: { acao: true } });
  if (!apelacao || apelacao.status !== "aberta") return { ok: false, erro: "Essa apelação não está aberta." };
  if (ator.id === apelacao.acao.moderadorId || ator.id === apelacao.autorId) {
    return { ok: false, erro: "Outra pessoa moderadora precisa julgar esta apelação." };
  }

  if (input.resultado === "procedente") {
    await reverterAcao(apelacao.acao.alvoTipo, apelacao.acao.alvoId, apelacao.acao.acao);
  }
  await db.apelacao.update({
    where: { id: apelacao.id },
    data: { status: "julgada", julgadaPorId: ator.id, resultado: texto },
  });
  return { ok: true };
}

export async function apelar(usuario: UsuarioAtual, acaoId: string, texto: string): Promise<Resultado> {
  if (texto.trim().length < 10) return { ok: false, erro: "Explique a apelação em pelo menos uma frase." };
  const acao = await db.acaoModeracao.findUnique({ where: { id: acaoId } });
  if (!acao) return { ok: false, erro: "Não encontramos essa decisão." };
  const autorId = await autorIdDoAlvo(acao.alvoTipo, acao.alvoId);
  if (autorId !== usuario.id) return { ok: false, erro: "Só quem foi afetado pela decisão pode apelar." };
  const aberta = await db.apelacao.findFirst({ where: { acaoId, status: "aberta" } });
  if (aberta) return { ok: false, erro: "Já existe uma apelação em análise." };
  await db.apelacao.create({ data: { acaoId, autorId: usuario.id, texto: texto.trim() } });
  return { ok: true };
}

export async function acoesContra(usuarioId: string) {
  const [perguntas, respostas, publicacoes, comentarios] = await Promise.all([
    db.pergunta.findMany({ where: { autorId: usuarioId }, select: { id: true } }),
    db.resposta.findMany({ where: { autorId: usuarioId }, select: { id: true } }),
    db.publicacao.findMany({ where: { autorId: usuarioId }, select: { id: true } }),
    db.comentario.findMany({ where: { autorId: usuarioId }, select: { id: true } }),
  ]);
  const ids = [
    usuarioId,
    ...perguntas.map((item) => item.id),
    ...respostas.map((item) => item.id),
    ...publicacoes.map((item) => item.id),
    ...comentarios.map((item) => item.id),
  ];
  const acoes = await db.acaoModeracao.findMany({
    where: { alvoId: { in: ids } },
    orderBy: { criadoEm: "desc" },
    take: 20,
    include: { apelacoes: true },
  });
  return acoes.map((acao) => ({
    id: acao.id,
    acao: acao.acao,
    motivo: acao.motivo,
    alvoTipo: acao.alvoTipo,
    criadaEm: acao.criadoEm,
    apelacaoAberta: acao.apelacoes.some((apelacao) => apelacao.status === "aberta"),
  }));
}

export async function listarPapeis(ator: UsuarioAtual) {
  if (!ehModerador(ator.papeis)) return [];
  const papeis = await db.papelUsuario.findMany({
    include: { usuario: { select: { apelido: true, email: true } }, area: { select: { nome: true, slug: true } } },
    orderBy: { papel: "asc" },
  });
  return papeis.map((papel) => ({
    id: papel.id,
    papel: papel.papel,
    apelido: papel.usuario.apelido,
    email: papel.usuario.email,
    area: papel.area?.nome ?? null,
    areaSlug: papel.area?.slug ?? null,
  }));
}

export async function concederPapel(
  ator: UsuarioAtual,
  input: { email: string; papel: string; areaSlug: string },
): Promise<Resultado> {
  if (!ehAdministrador(ator.papeis)) {
    return { ok: false, erro: "Só a administração concede papéis." };
  }
  if (input.papel !== "especialista" && input.papel !== "moderador") {
    return { ok: false, erro: "Esse papel não pode ser concedido por aqui." };
  }
  const pessoa = await db.usuario.findUnique({ where: { email: input.email.trim().toLowerCase() } });
  if (!pessoa) return { ok: false, erro: "Não encontramos essa conta." };

  let areaId: string | null = null;
  if (input.papel === "especialista") {
    const area = await db.noConhecimento.findUnique({ where: { slug: input.areaSlug.trim() } });
    if (!area) return { ok: false, erro: "Escolha a área do especialista pelo slug do mapa." };
    areaId = area.id;
  }
  const existe = await db.papelUsuario.findFirst({ where: { usuarioId: pessoa.id, papel: input.papel, areaId } });
  if (!existe) {
    await db.papelUsuario.create({ data: { usuarioId: pessoa.id, papel: input.papel, areaId } });
  }
  return { ok: true };
}

export async function revogarPapel(ator: UsuarioAtual, papelId: string): Promise<Resultado> {
  if (!ehAdministrador(ator.papeis)) return { ok: false, erro: "Só a administração revoga papéis." };
  const papel = await db.papelUsuario.findUnique({ where: { id: papelId } });
  if (!papel) return { ok: false, erro: "Não encontramos esse papel." };
  if (papel.papel === "administrador") {
    return { ok: false, erro: "A administração inicial não é removida por esta tela." };
  }
  await db.papelUsuario.delete({ where: { id: papelId } });
  return { ok: true };
}
