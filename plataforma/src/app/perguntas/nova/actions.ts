"use server";

import { redirect } from "next/navigation";
import { criarPergunta } from "@/lib/perguntas";
import { getUsuarioAtual } from "@/lib/session";

function falha(caminho: string, mensagem: string): never {
  redirect(`${caminho}?erro=${encodeURIComponent(mensagem)}`);
}

export async function acaoCriarPergunta(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) falha("/entrar", "Entre para continuar");

  const resultado = await criarPergunta(usuario, {
    titulo: String(formData.get("titulo") ?? ""),
    corpo: String(formData.get("corpo") ?? ""),
    dificuldade: String(formData.get("dificuldade") ?? ""),
    nivelEducacional: String(formData.get("nivelEducacional") ?? ""),
    objetivo: String(formData.get("objetivo") ?? ""),
    noIds: [String(formData.get("noId") ?? "")],
  });

  if (!resultado.ok) falha("/perguntas/nova", resultado.erro);
  redirect(`/perguntas/${resultado.id}`);
}
