"use server";

import { redirect } from "next/navigation";
import { entrar } from "@/lib/contas";
import { caminhoInterno } from "@/lib/texto";

export async function acaoEntrar(formData: FormData) {
  const depois = caminhoInterno(String(formData.get("depois") ?? ""));
  const resultado = await entrar(String(formData.get("email") ?? ""), String(formData.get("senha") ?? ""));
  if (!resultado.ok) {
    const consulta = new URLSearchParams({ erro: resultado.erro });
    if (depois !== "/") consulta.set("depois", depois);
    redirect(`/entrar?${consulta.toString()}`);
  }
  redirect(depois);
}
