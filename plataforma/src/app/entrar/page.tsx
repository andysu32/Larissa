import Link from "next/link";
import { AvisoErro } from "@/components/AvisoErro";
import { acaoEntrar } from "./actions";

export default async function PaginaEntrar({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="pagina">
      <h1>Entrar</h1>
      <AvisoErro erro={erro} />
      <form className="pilha cartao" action={acaoEntrar}>
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" autoComplete="current-password" required />
        </div>
        <button className="btn btn-primary" type="submit">
          Entrar
        </button>
      </form>
      <p className="muted">
        Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}
