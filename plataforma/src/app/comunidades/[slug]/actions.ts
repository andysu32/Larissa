"use server";

import { redirect } from "next/navigation";
import {
  comentar,
  criarEnquete,
  criarPublicacao,
  entrarComunidade,
  votarEnquete,
} from "@/lib/comunidades";
import { criarDenuncia } from "@/lib/moderacao";
import { getUsuarioAtual } from "@/lib/session";

function falha(slug: string, mensagem: string): never {
  redirect(`/comunidades/${encodeURIComponent(slug)}?erro=${encodeURIComponent(mensagem)}`);
}

function sucesso(slug: string): never {
  redirect(`/comunidades/${encodeURIComponent(slug)}`);
}

async function exigirUsuario() {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect(`/entrar?erro=${encodeURIComponent("Entre para continuar")}`);
  return usuario;
}

function slugDe(formData: FormData): string {
  return String(formData.get("slug") ?? "").trim();
}

export async function acaoEntrarComunidade(formData: FormData) {
  const slug = slugDe(formData);
  const usuario = await exigirUsuario();
  const resultado = await entrarComunidade(usuario, slug);
  if (!resultado.ok) falha(slug, resultado.erro);
  sucesso(slug);
}

export async function acaoCriarPublicacao(formData: FormData) {
  const slug = slugDe(formData);
  const usuario = await exigirUsuario();
  const resultado = await criarPublicacao(usuario, {
    slug,
    titulo: String(formData.get("titulo") ?? ""),
    corpo: String(formData.get("corpo") ?? ""),
    etiqueta: String(formData.get("etiqueta") ?? ""),
  });
  if (!resultado.ok) falha(slug, resultado.erro);
  sucesso(slug);
}

export async function acaoCriarEnquete(formData: FormData) {
  const slug = slugDe(formData);
  const usuario = await exigirUsuario();
  const opcoes = ["opcao1", "opcao2", "opcao3", "opcao4"]
    .map((nome) => String(formData.get(nome) ?? "").trim())
    .filter(Boolean);
  const resultado = await criarEnquete(usuario, {
    slug,
    titulo: String(formData.get("titulo") ?? ""),
    corpo: String(formData.get("corpo") ?? ""),
    opcoes,
  });
  if (!resultado.ok) falha(slug, resultado.erro);
  sucesso(slug);
}

export async function acaoComentar(formData: FormData) {
  const slug = slugDe(formData);
  const usuario = await exigirUsuario();
  const resultado = await comentar(usuario, {
    publicacaoId: String(formData.get("publicacaoId") ?? ""),
    corpo: String(formData.get("corpo") ?? ""),
  });
  if (!resultado.ok) falha(slug, resultado.erro);
  sucesso(slug);
}

export async function acaoVotarEnquete(formData: FormData) {
  const slug = slugDe(formData);
  const usuario = await exigirUsuario();
  const resultado = await votarEnquete(usuario, {
    enqueteId: String(formData.get("enqueteId") ?? ""),
    opcaoId: String(formData.get("opcaoId") ?? ""),
  });
  if (!resultado.ok) falha(slug, resultado.erro);
  sucesso(slug);
}

export async function acaoDenunciarPublicacao(formData: FormData) {
  const slug = slugDe(formData);
  const usuario = await exigirUsuario();
  const resultado = await criarDenuncia(usuario, {
    alvoTipo: "publicacao",
    alvoId: String(formData.get("alvoId") ?? ""),
    motivo: String(formData.get("motivo") ?? ""),
    detalhe: String(formData.get("detalhe") ?? ""),
  });
  if (!resultado.ok) falha(slug, resultado.erro);
  sucesso(slug);
}
