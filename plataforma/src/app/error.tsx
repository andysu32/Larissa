"use client";

export default function Erro({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="pagina">
      <h1>Algo saiu do lugar</h1>
      <p className="muted">A página não conseguiu carregar. Nada do seu estudo foi apagado.</p>
      <button className="btn btn-primary" type="button" onClick={() => reset()}>
        Tentar de novo
      </button>
    </div>
  );
}
