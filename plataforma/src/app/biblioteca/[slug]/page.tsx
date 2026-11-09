import Link from "next/link";
import { notFound } from "next/navigation";
import { obterLivro, ROTULO_ACESSO } from "@/lib/biblioteca";

export default async function PaginaLivro({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const livro = await obterLivro(slug);
  if (!livro) notFound();

  return (
    <div className="pagina">
      <p className="olho">
        <Link href="/biblioteca">Biblioteca</Link>
      </p>
      <h1>{livro.titulo}</h1>
      <p className={`selo selo-${livro.tipoAcesso === "comercial" ? "incorreta" : "correta"}`}>
        <strong>{ROTULO_ACESSO[livro.tipoAcesso] ?? livro.tipoAcesso}</strong>
        <span>
          {livro.tipoAcesso === "comercial"
            ? "A plataforma não guarda o arquivo deste livro."
            : "O arquivo ou a leitura gratuita fica na fonte oficial."}
        </span>
      </p>
      <p>
        <strong>Autores.</strong> {livro.autores}
      </p>
      <p>
        <strong>Nível.</strong> {livro.nivel || "Não informado"}
      </p>
      <p>
        <strong>Edição.</strong> {livro.edicao || "Não informada"}
      </p>
      {livro.assunto ? (
        <p>
          <strong>Assunto.</strong>{" "}
          <Link href={`/biblioteca?assunto=${livro.assuntoSlug}`}>{livro.assunto}</Link>
        </p>
      ) : null}
      <p>{livro.descricao}</p>
      <a className="btn btn-primary" href={livro.ondeObter} target="_blank" rel="noreferrer noopener">
        {livro.tipoAcesso === "comercial" ? "Onde encontrar legalmente" : "Abrir material gratuito"}
      </a>
    </div>
  );
}
