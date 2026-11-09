"use server";

import { redirect } from "next/navigation";
import { cadastrar } from "@/lib/contas";

function falha(caminho: string, mensagem: string): never {
  redirect(`${caminho}?erro=${encodeURIComponent(mensagem)}`);
}

export async function acaoCadastrar(formData: FormData) {
  const confirmacao = formData.get("confirmacao") === "sim" ? "sim" : "";
  const objetivoBruto = String(formData.get("objetivo") ?? "").trim();
  const resultado = await cadastrar({
    nome: String(formData.get("nome") ?? ""),
    apelido: String(formData.get("apelido") ?? ""),
    email: String(formData.get("email") ?? ""),
    senha: String(formData.get("senha") ?? ""),
    nascimento: String(formData.get("nascimento") ?? ""),
    confirmacao,
    objetivo: objetivoBruto || undefined,
  });
  if (!resultado.ok) falha("/cadastro", resultado.erro);
  redirect("/");
}
