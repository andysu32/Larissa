import { db } from "./db";
import { criarSessao } from "./session";
import { hashSenha, verificarSenha } from "./password";
import { faixaCadastro, idadeEm } from "./regras";
import { apresentarAutor, fonteDe, nomeVisivel } from "./texto";
import type { Resultado, UsuarioAtual } from "./tipos";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function cadastrar(input: {
  nome: string;
  apelido: string;
  email: string;
  senha: string;
  nascimento: string;
  confirmacao: string;
  objetivo?: string;
}): Promise<Resultado> {
  if (input.confirmacao !== "sim") {
    return { ok: false, erro: "Confirme que você quer estudar e ajudar outras pessoas." };
  }
  const nome = input.nome.trim();
  const apelido = input.apelido.trim();
  const email = input.email.trim().toLowerCase();
  if (nome.length < 2 || nome.length > 80) {
    return { ok: false, erro: "Informe seu nome com pelo menos 2 letras." };
  }
  if (!/^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 .'-]{1,31}$/.test(apelido)) {
    return { ok: false, erro: "O apelido público precisa ter de 2 a 32 caracteres." };
  }
  if (!EMAIL.test(email) || email.length > 120) return { ok: false, erro: "Informe um e-mail válido." };
  if (input.senha.length < 8 || input.senha.length > 200) {
    return { ok: false, erro: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.nascimento)) {
    return { ok: false, erro: "Informe a data de nascimento." };
  }
  const nascimento = new Date(`${input.nascimento}T00:00:00.000Z`);
  if (Number.isNaN(nascimento.getTime())) return { ok: false, erro: "Data de nascimento inválida." };
  const faixa = faixaCadastro(idadeEm(nascimento, new Date()));
  if (faixa === "recusado") return { ok: false, erro: "A conta é para pessoas a partir de 13 anos." };

  const existe = await db.usuario.findUnique({ where: { email } });
  if (existe) return { ok: false, erro: "Já existe uma conta com este e-mail." };

  const restrito = faixa === "restrito";
  const usuario = await db.usuario.create({
    data: {
      email,
      senhaHash: hashSenha(input.senha),
      nome,
      apelido,
      nascimento,
      restrito,
      perfil: {
        create: {
          mostrarNome: false,
          mostrarAreas: true,
          mostrarReputacao: !restrito,
          mostrarObjetivos: false,
          mostrarProgresso: false,
          mostrarComunidades: !restrito,
        },
      },
      reputacao: { create: {} },
    },
  });

  const objetivo = input.objetivo?.trim() ?? "";
  if (objetivo.length >= 4) {
    await db.objetivoEstudo.create({
      data: { usuarioId: usuario.id, descricao: objetivo.slice(0, 200) },
    });
  }
  await criarSessao(usuario.id);
  return { ok: true };
}

export async function entrar(email: string, senha: string): Promise<Resultado> {
  const normalizado = email.trim().toLowerCase();
  const usuario = await db.usuario.findUnique({ where: { email: normalizado } });
  if (!usuario) {
    verificarSenha(senha, hashSenha("placeholder-local"));
    return { ok: false, erro: "E-mail ou senha não conferem." };
  }
  if (!verificarSenha(senha, usuario.senhaHash)) {
    return { ok: false, erro: "E-mail ou senha não conferem." };
  }
  await criarSessao(usuario.id);
  return { ok: true };
}

export async function obterMinhaConta(usuarioId: string) {
  const usuario = await db.usuario.findUnique({
    where: { id: usuarioId },
    include: { perfil: true, reputacao: true, objetivo: true },
  });
  if (!usuario) return null;
  return {
    nome: usuario.nome,
    apelido: usuario.apelido,
    email: usuario.email,
    restrito: usuario.restrito,
    bloqueado: usuario.bloqueado,
    bio: usuario.perfil?.bio ?? "",
    mostrarNome: usuario.perfil?.mostrarNome ?? false,
    mostrarAreas: usuario.perfil?.mostrarAreas ?? true,
    mostrarReputacao: usuario.perfil?.mostrarReputacao ?? true,
    mostrarObjetivos: usuario.perfil?.mostrarObjetivos ?? false,
    mostrarProgresso: usuario.perfil?.mostrarProgresso ?? false,
    mostrarComunidades: usuario.perfil?.mostrarComunidades ?? true,
    tamanhoFonte: fonteDe(usuario.perfil?.tamanhoFonte),
    precisao: usuario.reputacao?.precisao ?? 0,
    clareza: usuario.reputacao?.clareza ?? 0,
    contribuicao: usuario.reputacao?.contribuicao ?? 0,
    objetivo: usuario.objetivo
      ? {
          descricao: usuario.objetivo.descricao,
          nivel: usuario.objetivo.nivel,
          prova: usuario.objetivo.prova,
          minutosPorDia: usuario.objetivo.minutosPorDia,
          dificuldades: usuario.objetivo.dificuldades,
        }
      : null,
  };
}

export async function atualizarPerfil(
  usuario: UsuarioAtual,
  input: {
    apelido: string;
    bio: string;
    mostrarNome: boolean;
    mostrarAreas: boolean;
    mostrarReputacao: boolean;
    mostrarObjetivos: boolean;
    mostrarProgresso: boolean;
    mostrarComunidades: boolean;
    tamanhoFonte: string;
  },
): Promise<Resultado> {
  const apelido = input.apelido.trim();
  const bio = input.bio.trim();
  if (!/^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 .'-]{1,31}$/.test(apelido)) {
    return { ok: false, erro: "O apelido público precisa ter de 2 a 32 caracteres." };
  }
  if (bio.length > 280) return { ok: false, erro: "A bio pode ter até 280 caracteres." };

  const restrito = usuario.restrito;
  await db.usuario.update({
    where: { id: usuario.id },
    data: {
      apelido,
      perfil: {
        upsert: {
          create: {
            bio,
            mostrarNome: restrito ? false : input.mostrarNome,
            mostrarAreas: input.mostrarAreas,
            mostrarReputacao: restrito ? false : input.mostrarReputacao,
            mostrarObjetivos: restrito ? false : input.mostrarObjetivos,
            mostrarProgresso: restrito ? false : input.mostrarProgresso,
            mostrarComunidades: restrito ? false : input.mostrarComunidades,
            tamanhoFonte: fonteDe(input.tamanhoFonte),
          },
          update: {
            bio,
            mostrarNome: restrito ? false : input.mostrarNome,
            mostrarAreas: input.mostrarAreas,
            mostrarReputacao: restrito ? false : input.mostrarReputacao,
            mostrarObjetivos: restrito ? false : input.mostrarObjetivos,
            mostrarProgresso: restrito ? false : input.mostrarProgresso,
            mostrarComunidades: restrito ? false : input.mostrarComunidades,
            tamanhoFonte: fonteDe(input.tamanhoFonte),
          },
        },
      },
    },
  });
  return { ok: true };
}

export async function salvarObjetivo(
  usuarioId: string,
  input: {
    descricao: string;
    nivel: string;
    prova: string;
    minutosPorDia: number | null;
    dificuldades: string;
  },
): Promise<Resultado> {
  const descricao = input.descricao.trim();
  const nivel = input.nivel.trim();
  const prova = input.prova.trim();
  const dificuldades = input.dificuldades.trim();
  if (descricao.length < 4 || descricao.length > 200) {
    return { ok: false, erro: "Descreva seu objetivo em uma frase." };
  }
  if (nivel.length > 80 || prova.length > 80) return { ok: false, erro: "Nível ou prova longo demais." };
  if (dificuldades.length > 400) return { ok: false, erro: "Resuma as dificuldades em até 400 caracteres." };
  if (input.minutosPorDia !== null && (input.minutosPorDia < 0 || input.minutosPorDia > 720)) {
    return { ok: false, erro: "Informe os minutos por dia entre 0 e 720, ou deixe em branco." };
  }

  await db.objetivoEstudo.upsert({
    where: { usuarioId },
    create: { usuarioId, descricao, nivel, prova, minutosPorDia: input.minutosPorDia, dificuldades },
    update: { descricao, nivel, prova, minutosPorDia: input.minutosPorDia, dificuldades },
  });
  return { ok: true };
}

export async function obterPerfilPublico(id: string) {
  const usuario = await db.usuario.findUnique({
    where: { id },
    include: {
      perfil: true,
      reputacao: true,
      objetivo: true,
      perguntas: {
        where: { oculto: false },
        include: { nos: { include: { no: true } } },
      },
      membros: { include: { comunidade: true } },
      _count: {
        select: {
          perguntas: { where: { oculto: false } },
          respostas: { where: { oculto: false } },
        },
      },
    },
  });
  if (!usuario) return null;

  const perfil = usuario.perfil;
  const restrito = usuario.restrito;
  const areas = restrito || perfil?.mostrarAreas === false
    ? []
    : [...new Set(usuario.perguntas.flatMap((pergunta) => pergunta.nos.map((item) => item.no.nome)))];

  return {
    id: usuario.id,
    nome: nomeVisivel({
      nome: usuario.nome,
      apelido: usuario.apelido,
      restrito,
      mostrarNome: perfil?.mostrarNome ?? false,
    }),
    bio: restrito ? "" : (perfil?.bio ?? ""),
    areas,
    reputacao:
      !restrito && perfil?.mostrarReputacao !== false
        ? {
            precisao: usuario.reputacao?.precisao ?? 0,
            clareza: usuario.reputacao?.clareza ?? 0,
            contribuicao: usuario.reputacao?.contribuicao ?? 0,
          }
        : null,
    objetivo: !restrito && perfil?.mostrarObjetivos ? usuario.objetivo?.descricao ?? null : null,
    progresso:
      !restrito && perfil?.mostrarProgresso
        ? { perguntas: usuario._count.perguntas, respostas: usuario._count.respostas }
        : null,
    comunidades:
      !restrito && perfil?.mostrarComunidades !== false
        ? usuario.membros.map((membro) => ({
            slug: membro.comunidade.slug,
            nome: membro.comunidade.nome,
          }))
        : [],
  };
}

export function nomeDeAutor(
  autor: Parameters<typeof apresentarAutor>[0],
): string {
  return apresentarAutor(autor);
}
