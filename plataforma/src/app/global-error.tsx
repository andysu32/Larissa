"use client";

export default function ErroGlobal({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "Segoe UI, sans-serif", padding: "2rem" }}>
        <h1>Algo saiu do lugar</h1>
        <p>A plataforma não conseguiu abrir esta tela.</p>
        <button type="button" onClick={() => reset()}>
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
