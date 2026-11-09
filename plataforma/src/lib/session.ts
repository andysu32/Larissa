import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";
import type { UsuarioAtual } from "./tipos";
import { fonteDe } from "./texto";

const COOKIE = "aprenda_sessao";

export async function getUsuarioAtual(): Promise<UsuarioAtual | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const sessao = await db.sessao.findUnique({
    where: { token },
    include: {
      usuario: {
        include: {
          perfil: true,
          papeis: { select: { papel: true, areaId: true } },
          reputacao: true,
        },
      },
    },
  });

  if (!sessao || sessao.expiraEm.getTime() < Date.now()) return null;
  const usuario = sessao.usuario;
  return {
    id: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    apelido: usuario.apelido,
    restrito: usuario.restrito,
    bloqueado: usuario.bloqueado,
    publicacaoRestrita: usuario.publicacaoRestrita,
    precisao: usuario.reputacao?.precisao ?? 0,
    clareza: usuario.reputacao?.clareza ?? 0,
    contribuicao: usuario.reputacao?.contribuicao ?? 0,
    papeis: usuario.papeis,
    tamanhoFonte: fonteDe(usuario.perfil?.tamanhoFonte),
    mostrarNome: usuario.perfil?.mostrarNome ?? false,
  };
}

export async function criarSessao(usuarioId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiraEm = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await db.sessao.deleteMany({ where: { usuarioId } });
  await db.sessao.create({ data: { token, usuarioId, expiraEm } });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiraEm,
  });
}

export async function encerrarSessao(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.sessao.deleteMany({ where: { token } });
  jar.delete(COOKIE);
}
