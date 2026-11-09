"use server";

import { redirect } from "next/navigation";
import { entrar } from "@/lib/contas";

function falha(caminho: string, mensagem: string): never {
  redirect(`${caminho}?erro=${encodeURIComponent(mensagem)}`);
}

export async function acaoEntrar(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const senha = String(formData.get("senha") ?? "");
  const resultado = await entrar(email, senha);
  if (!resultado.ok) falha("/entrar", resultado.erro);
  redirect("/");
}
