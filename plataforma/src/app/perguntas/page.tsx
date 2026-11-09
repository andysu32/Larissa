import Link from "next/link";
import { listarPerguntas } from "@/lib/perguntas";
import { ROTULO_DIFICULDADE, ROTULO_ESTADO } from "@/lib/rotulos";

export default async function PaginaPerguntas() {
  const perguntas = await listarPerguntas();

  return (
    <div className="pagina">
      <div className="entre">
        <div>
          <p className="olho">Dúvidas classificadas</p>
          <h1>Perguntas</h1>
        </div>
        <Link className="btn btn-primary" href="/perguntas/nova">
          Nova pergunta
        </Link>
      </div>

      {perguntas.length === 0 ? (
        <p className="muted">Ainda não há perguntas publicadas. Seja a primeira pessoa a abrir uma dúvida.</p>
      ) : (
        <ul className="lista pilha" style={{ marginTop: "1.2rem" }}>
          {perguntas.map((pergunta) => (
            <li key={pergunta.id}>
              <Link className="cartao-link" href={`/perguntas/${pergunta.id}`}>
                <h2>{pergunta.titulo}</h2>
                <p className="meta">
                  {pergunta.autor} · {ROTULO_DIFICULDADE[pergunta.dificuldade] ?? pergunta.dificuldade} ·{" "}
                  {pergunta.totalRespostas} resposta{pergunta.totalRespostas === 1 ? "" : "s"}
                  {pergunta.melhorEstado
                    ? ` · ${ROTULO_ESTADO[pergunta.melhorEstado] ?? pergunta.melhorEstado}`
                    : ""}
                </p>
                {pergunta.assuntos.length > 0 ? (
                  <p className="muted">{pergunta.assuntos.join(" · ")}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
