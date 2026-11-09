import Link from "next/link";
import { AvisoErro } from "@/components/AvisoErro";
import { caminhoInterno } from "@/lib/texto";
import { acaoCadastrar } from "./actions";

export default async function PaginaCadastro({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; depois?: string }>;
}) {
  const { erro, depois } = await searchParams;
  const destino = caminhoInterno(depois);

  return (
    <div className="pagina">
      <h1>Criar conta</h1>
      <p className="subtitulo">Comece a estudar e ajudar outras pessoas na plataforma Aprenda.</p>
      <AvisoErro erro={erro} />
      <form className="pilha cartao" action={acaoCadastrar}>
        <input type="hidden" name="depois" value={destino} />
        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" autoComplete="name" required />
        </div>
        <div className="campo">
          <label htmlFor="apelido">Apelido público</label>
          <input id="apelido" name="apelido" autoComplete="username" required />
        </div>
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" autoComplete="new-password" required />
        </div>
        <div className="campo">
          <label htmlFor="nascimento">Data de nascimento</label>
          <input id="nascimento" name="nascimento" type="date" required />
        </div>
        <div className="campo">
          <label htmlFor="objetivo">Objetivo de estudo (opcional)</label>
          <input id="objetivo" name="objetivo" placeholder="O que você quer aprender?" />
        </div>
        <label className="cheque">
          <input name="confirmacao" type="checkbox" value="sim" />
          Tenho 13 anos ou mais e quero estudar e ajudar outras pessoas.
        </label>
        <button className="btn btn-primary" type="submit">
          Criar conta
        </button>
      </form>
      <p className="muted">
        Já tem conta?{" "}
        <Link href={destino === "/" ? "/entrar" : `/entrar?depois=${encodeURIComponent(destino)}`}>Entrar</Link>
      </p>
    </div>
  );
}
