"use server";

import { redirect } from "next/navigation";
import { encerrarSessao } from "./session";

export async function sair(): Promise<void> {
  await encerrarSessao();
  redirect("/");
}
