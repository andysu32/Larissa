"use server";

import { redirect } from "next/navigation";
import { aplicarAcao, concederPapel, julgarApelacao, revogarPapel } from "@/lib/moderacao";
import { getUsuarioAtual } from "@/lib/session";

function falha(mensagem: string): never {
  redirect(`/moderacao?erro=${encodeURIComponent(mensagem)}`);
}

export async function acaoRegistrarDecisao(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) falha("Entre na sua conta.");

  const resultado = await aplicarAcao(usuario, {
    denunciaId: String(formData.get("denunciaId") ?? ""),
    alvoTipo: String(formData.get("alvoTipo") ?? ""),
    alvoId: String(formData.get("alvoId") ?? ""),
    acao: String(formData.get("acao") ?? ""),
    motivo: String(formData.get("motivo") ?? ""),
  });

  if (!resultado.ok) falha(resultado.erro);
  redirect("/moderacao");
}

export async function acaoJulgarApelacao(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) falha("Entre na sua conta.");

  const resultado = await julgarApelacao(usuario, {
    apelacaoId: String(formData.get("apelacaoId") ?? ""),
    resultado: String(formData.get("resultado") ?? "") as "procedente" | "improcedente",
    texto: String(formData.get("texto") ?? ""),
  });

  if (!resultado.ok) falha(resultado.erro);
  redirect("/moderacao");
}

export async function acaoConcederPapel(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) falha("Entre na sua conta.");

  const resultado = await concederPapel(usuario, {
    email: String(formData.get("email") ?? ""),
    papel: String(formData.get("papel") ?? ""),
    areaSlug: String(formData.get("areaSlug") ?? ""),
  });

  if (!resultado.ok) falha(resultado.erro);
  redirect("/moderacao");
}

export async function acaoRevogarPapel(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) falha("Entre na sua conta.");

  const resultado = await revogarPapel(usuario, String(formData.get("papelId") ?? ""));

  if (!resultado.ok) falha(resultado.erro);
  redirect("/moderacao");
}
