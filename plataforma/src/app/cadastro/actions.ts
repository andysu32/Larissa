"use server";

import { redirect } from "next/navigation";
import { cadastrar } from "@/lib/contas";
import { caminhoInterno } from "@/lib/texto";

export async function acaoCadastrar(formData: FormData) {
  const depois = caminhoInterno(String(formData.get("depois") ?? ""));
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
  if (!resultado.ok) {
    const consulta = new URLSearchParams({ erro: resultado.erro });
    if (depois !== "/") consulta.set("depois", depois);
    redirect(`/cadastro?${consulta.toString()}`);
  }
  redirect(depois);
}
