import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashSenha(senha: string): string {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, sal, 32).toString("hex");
  return `${sal}:${hash}`;
}

export function verificarSenha(senha: string, armazenada: string): boolean {
  const [sal, hash] = armazenada.split(":");
  if (!sal || !hash) return false;
  const atual = scryptSync(senha, sal, 32);
  const esperado = Buffer.from(hash, "hex");
  if (atual.length !== esperado.length) return false;
  return timingSafeEqual(atual, esperado);
}
