import Link from "next/link";
import { listarComunidades } from "@/lib/comunidades";

export default async function PaginaComunidades() {
  const comunidades = await listarComunidades();

  return (
    <div className="pagina">
      <p className="olho">Comunidades</p>
      <h1>Comunidades</h1>
      <p className="muted">Estude e converse com quem segue o mesmo caminho.</p>

      {comunidades.length === 0 ? (
        <p className="muted">Ainda não há comunidades cadastradas.</p>
      ) : (
        <div className="grade" aria-label="Lista de comunidades">
          {comunidades.map((comunidade) => (
            <Link
              className="cartao-link"
              key={comunidade.slug}
              href={`/comunidades/${comunidade.slug}`}
            >
              <h2>{comunidade.nome}</h2>
              <p className="muted">{comunidade.descricao}</p>
              <p className="meta">
                {comunidade.membros} {comunidade.membros === 1 ? "membro" : "membros"} ·{" "}
                {comunidade.publicacoes}{" "}
                {comunidade.publicacoes === 1 ? "publicação" : "publicações"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
