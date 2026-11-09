import Link from "next/link";
import { arvoreConhecimento, type NoArvore } from "@/lib/arvore";

function NosArvore({ filhos }: { filhos: NoArvore[] }) {
  if (filhos.length === 0) return null;
  return (
    <ul className="arvore">
      {filhos.map((no) => (
        <li key={no.id}>
          <strong>
            <Link href={`/perguntas?assunto=${no.slug}`}>{no.nome}</Link>
          </strong>{" "}
          <span className="muted">({no.tipo})</span>
          {no.requisitos.length > 0 ? (
            <p className="muted">Antes: {no.requisitos.join(", ")}</p>
          ) : null}
          <NosArvore filhos={no.filhos} />
        </li>
      ))}
    </ul>
  );
}

export default async function PaginaMapa() {
  const arvore = await arvoreConhecimento();

  return (
    <div className="pagina">
      <p className="olho">Conhecimento</p>
      <h1>Mapa de conhecimento</h1>
      <p className="subtitulo muted">
        Cada assunto abre as perguntas daquele trecho. O que vem antes aparece na linha de baixo.
      </p>
      {arvore.length === 0 ? (
        <p className="muted">O mapa ainda não foi populado.</p>
      ) : (
        <NosArvore filhos={arvore} />
      )}
    </div>
  );
}
