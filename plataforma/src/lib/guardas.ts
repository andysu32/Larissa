import type { UsuarioAtual } from "./tipos";

export function podePublicar(usuario: UsuarioAtual): { ok: true } | { ok: false; erro: string } {
  if (usuario.bloqueado) {
    return {
      ok: false,
      erro: "Esta conta está bloqueada para publicar. Você ainda pode ler e registrar uma apelação.",
    };
  }
  if (usuario.publicacaoRestrita) {
    return { ok: false, erro: "A publicação está temporariamente limitada nesta conta." };
  }
  return { ok: true };
}
