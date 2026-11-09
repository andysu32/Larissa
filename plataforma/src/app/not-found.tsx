import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="pagina">
      <h1>Não encontramos esta página</h1>
      <p className="muted">O conteúdo pode ter sido movido ou ainda não existe.</p>
      <Link className="btn btn-primary" href="/">
        Voltar ao início
      </Link>
    </div>
  );
}
