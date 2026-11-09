import { arvoreConhecimento, type NoArvore } from "@/lib/arvore";

function NosArvore({ filhos }: { filhos: NoArvore[] }) {
  if (filhos.length === 0) return null;
  return (
    <ul className="arvore">
      {filhos.map((no) => (
        <li key={no.id}>
          <strong>{no.nome}</strong> <span className="muted">({no.tipo})</span>
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
      <p className="subtitulo muted">Assuntos organizados em trilhas e pré-requisitos.</p>
      {arvore.length === 0 ? (
        <p className="muted">O mapa ainda não foi populado.</p>
      ) : (
        <NosArvore filhos={arvore} />
      )}
    </div>
  );
}
