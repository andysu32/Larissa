import Link from "next/link";
import { EstadoSelo } from "@/components/EstadoSelo";
import { listarPendentes } from "@/lib/respostas";
import { formatarData } from "@/lib/texto";

export default async function PaginaRevisao() {
  const pendentes = await listarPendentes();

  return (
    <div className="pagina">
      <p className="olho">Fila humana</p>
      <h1>Revisão</h1>
      <p className="subtitulo">
        Estas respostas ainda não têm veredito. A análise automática só encaminha para cá. Ela não confirma correção.
      </p>

      {pendentes.length === 0 ? (
        <p className="muted">Nada aguardando revisão humana.</p>
      ) : (
        <ul className="lista">
          {pendentes.map((item) => (
            <li key={item.id}>
              <Link className="cartao-link" href={`/perguntas/${item.perguntaId}`}>
                <EstadoSelo estado={item.estado} />
                <h2>{item.perguntaTitulo}</h2>
                <p>{item.trecho}</p>
                <p className="meta">
                  {item.autor} · {formatarData(item.criadaEm)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
