"use server";

import { redirect } from "next/navigation";
import { atualizarPerfil } from "@/lib/contas";
import { apelar } from "@/lib/moderacao";
import { getUsuarioAtual } from "@/lib/session";

function falha(caminho: string, mensagem: string): never {
  redirect(`${caminho}?erro=${encodeURIComponent(mensagem)}`);
}

export async function acaoAtualizarPerfil(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/entrar");

  const resultado = await atualizarPerfil(usuario, {
    apelido: String(formData.get("apelido") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    mostrarNome: formData.get("mostrarNome") === "on",
    mostrarAreas: formData.get("mostrarAreas") === "on",
    mostrarReputacao: formData.get("mostrarReputacao") === "on",
    mostrarObjetivos: formData.get("mostrarObjetivos") === "on",
    mostrarProgresso: formData.get("mostrarProgresso") === "on",
    mostrarComunidades: formData.get("mostrarComunidades") === "on",
    tamanhoFonte: String(formData.get("tamanhoFonte") ?? "md"),
  });
  if (!resultado.ok) falha("/perfil", resultado.erro);
  redirect("/perfil");
}

export async function acaoApelar(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/entrar");

  const resultado = await apelar(
    usuario,
    String(formData.get("acaoId") ?? ""),
    String(formData.get("texto") ?? ""),
  );
  if (!resultado.ok) falha("/perfil", resultado.erro);
  redirect("/perfil");
}
