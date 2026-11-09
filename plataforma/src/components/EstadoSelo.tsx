import { AJUDA_ESTADO, ROTULO_ESTADO } from "@/lib/rotulos";

export function EstadoSelo({ estado }: { estado: string }) {
  const rotulo = ROTULO_ESTADO[estado] ?? "Estado desconhecido";
  const ajuda = AJUDA_ESTADO[estado] ?? "Este estado não altera o conteúdo por conta própria.";
  return (
    <p className={`selo selo-${estado}`}>
      <strong>{rotulo}</strong>
      <span>{ajuda}</span>
    </p>
  );
}
