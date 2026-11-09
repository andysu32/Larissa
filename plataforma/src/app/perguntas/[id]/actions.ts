"use server";

import { redirect } from "next/navigation";
import { criarDenuncia } from "@/lib/moderacao";
import { criarResposta, editarResposta, votarClareza } from "@/lib/respostas";
import { getUsuarioAtual } from "@/lib/session";
import { aplicarVeredito } from "@/lib/veredito";

function falha(perguntaId: string, mensagem: string): never {
  redirect(`/perguntas/${perguntaId}?erro=${encodeURIComponent(mensagem)}`);
}

function exigeSessao(): never {
  redirect("/entrar?erro=Entre%20para%20continuar");
}

function perguntaIdDe(formData: FormData): string {
  return String(formData.get("perguntaId") ?? "");
}

export async function acaoCriarResposta(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) exigeSessao();
  const perguntaId = perguntaIdDe(formData);

  const fonteTitulo = String(formData.get("fonteTitulo") ?? "").trim();
  const fonteUrl = String(formData.get("fonteUrl") ?? "").trim();
  const fonteCitacao = String(formData.get("fonteCitacao") ?? "").trim();
  const fontes =
    fonteTitulo || fonteUrl || fonteCitacao ? [{ titulo: fonteTitulo, url: fonteUrl, citacao: fonteCitacao }] : [];

  const resultado = await criarResposta(usuario, {
    perguntaId,
    corpo: String(formData.get("corpo") ?? ""),
    fontes,
  });
  if (!resultado.ok) falha(perguntaId, resultado.erro);
  redirect(`/perguntas/${perguntaId}?ok=${encodeURIComponent("Resposta publicada. Ela aguarda revisão humana.")}`);
}

export async function acaoEditarResposta(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) exigeSessao();
  const perguntaId = perguntaIdDe(formData);

  const resultado = await editarResposta(usuario, {
    respostaId: String(formData.get("respostaId") ?? ""),
    corpo: String(formData.get("corpo") ?? ""),
  });
  if (!resultado.ok) falha(perguntaId, resultado.erro);
  redirect(
    `/perguntas/${perguntaId}?ok=${encodeURIComponent("Edição salva. Se havia veredito, a resposta voltou para revisão humana.")}`,
  );
}

export async function acaoVotarClareza(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) exigeSessao();
  const perguntaId = perguntaIdDe(formData);
  const valor = Number(formData.get("valor"));

  const resultado = await votarClareza(usuario, String(formData.get("respostaId") ?? ""), valor);
  if (!resultado.ok) falha(perguntaId, resultado.erro);
  redirect(
    `/perguntas/${perguntaId}?ok=${encodeURIComponent("Avaliação de clareza registrada. Isso não muda se a resposta está correta.")}`,
  );
}

export async function acaoAplicarVeredito(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) exigeSessao();
  const perguntaId = perguntaIdDe(formData);

  const resultado = await aplicarVeredito(usuario, {
    respostaId: String(formData.get("respostaId") ?? ""),
    estado: String(formData.get("estado") ?? ""),
    explicacao: String(formData.get("explicacao") ?? ""),
  });
  if (!resultado.ok) falha(perguntaId, resultado.erro);
  redirect(`/perguntas/${perguntaId}?ok=${encodeURIComponent("Veredito registrado com a explicação.")}`);
}

export async function acaoDenunciar(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) exigeSessao();
  const perguntaId = perguntaIdDe(formData);

  const resultado = await criarDenuncia(usuario, {
    alvoTipo: String(formData.get("alvoTipo") ?? ""),
    alvoId: String(formData.get("alvoId") ?? ""),
    motivo: String(formData.get("motivo") ?? ""),
    detalhe: String(formData.get("detalhe") ?? ""),
  });
  if (!resultado.ok) falha(perguntaId, resultado.erro);
  redirect(`/perguntas/${perguntaId}?ok=${encodeURIComponent("Denúncia enviada para a moderação.")}`);
}
