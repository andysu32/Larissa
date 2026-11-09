import Link from "next/link";
import { AvisoErro } from "@/components/AvisoErro";
import { caminhoInterno } from "@/lib/texto";
import { acaoEntrar } from "./actions";

export default async function PaginaEntrar({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; depois?: string }>;
}) {
  const { erro, depois } = await searchParams;
  const destino = caminhoInterno(depois);

  return (
    <div className="pagina">
      <h1>Entrar</h1>
      <AvisoErro erro={erro} />
      <form className="pilha cartao" action={acaoEntrar}>
        <input type="hidden" name="depois" value={destino} />
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" autoComplete="current-password" required minLength={8} />
        </div>
        <button className="btn btn-primary" type="submit">
          Entrar
        </button>
      </form>
      <p className="muted">
        Ainda não tem conta?{" "}
        <Link href={destino === "/" ? "/cadastro" : `/cadastro?depois=${encodeURIComponent(destino)}`}>
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
