"use server";

import { redirect } from "next/navigation";
import { salvarObjetivo } from "@/lib/contas";
import { getUsuarioAtual } from "@/lib/session";

function falha(caminho: string, mensagem: string): never {
  redirect(`${caminho}?erro=${encodeURIComponent(mensagem)}`);
}

export async function acaoSalvarObjetivo(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) falha("/progresso", "Entre na sua conta para registrar o objetivo.");

  const minutosBruto = String(formData.get("minutosPorDia") ?? "").trim();
  let minutosPorDia: number | null = null;
  if (minutosBruto !== "") {
    const valor = Number(minutosBruto);
    if (Number.isNaN(valor)) {
      falha("/progresso", "Informe os minutos por dia entre 0 e 720, ou deixe em branco.");
    }
    minutosPorDia = valor;
  }

  const resultado = await salvarObjetivo(usuario.id, {
    descricao: String(formData.get("descricao") ?? ""),
    nivel: String(formData.get("nivel") ?? ""),
    prova: String(formData.get("prova") ?? ""),
    minutosPorDia,
    dificuldades: String(formData.get("dificuldades") ?? ""),
  });

  if (!resultado.ok) falha("/progresso", resultado.erro);
  redirect("/progresso");
}
