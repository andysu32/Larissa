import Link from "next/link";
import { AvisoErro } from "@/components/AvisoErro";
import { arvoreConhecimento, type NoArvore } from "@/lib/arvore";
import { listarPerguntas } from "@/lib/perguntas";
import { ROTULO_DIFICULDADE, ROTULO_ESTADO } from "@/lib/rotulos";

function acharNome(nos: NoArvore[], slug: string): string | null {
  for (const no of nos) {
    if (no.slug === slug) return no.nome;
    const filho = acharNome(no.filhos, slug);
    if (filho) return filho;
  }
  return null;
}

export default async function PaginaPerguntas({
  searchParams,
}: {
  searchParams: Promise<{ assunto?: string }>;
}) {
  const { assunto } = await searchParams;
  const [perguntas, mapa] = await Promise.all([
    listarPerguntas(50, assunto ? { assunto } : undefined),
    arvoreConhecimento(),
  ]);
  const nomeAssunto = assunto ? acharNome(mapa, assunto) : null;

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

      <nav className="linha" aria-label="Filtrar por assunto">
        <Link className={assunto ? "btn btn-ghost" : "btn btn-primary"} href="/perguntas">
          Todas
        </Link>
        {mapa.map((no) => (
          <Link
            key={no.slug}
            className={assunto === no.slug ? "btn btn-primary" : "btn btn-ghost"}
            href={`/perguntas?assunto=${no.slug}`}
          >
            {no.nome}
          </Link>
        ))}
      </nav>

      {assunto ? (
        <AvisoErro erro={nomeAssunto ? undefined : "Esse assunto não está no mapa."} />
      ) : null}
      {nomeAssunto ? <p className="muted">Mostrando {nomeAssunto} e o que está dentro deste assunto.</p> : null}

      {perguntas.length === 0 ? (
        <p className="muted">
          {assunto
            ? "Ainda não há perguntas neste trecho do mapa."
            : "Ainda não há perguntas publicadas. Seja a primeira pessoa a abrir uma dúvida."}
        </p>
      ) : (
        <ul className="lista pilha" style={{ marginTop: "1.2rem" }}>
          {perguntas.map((pergunta) => (
            <li key={pergunta.id}>
              <Link className="cartao-link" href={`/perguntas/${pergunta.id}`}>
                <h2>{pergunta.titulo}</h2>
                <p className="meta">
                  {pergunta.autor} · {ROTULO_DIFICULDADE[pergunta.dificuldade] ?? pergunta.dificuldade} ·{" "}
                  {pergunta.totalRespostas === 1 ? "1 resposta" : `${pergunta.totalRespostas} respostas`}
                  {pergunta.melhorEstado
                    ? ` · ${ROTULO_ESTADO[pergunta.melhorEstado] ?? pergunta.melhorEstado}`
                    : " · sem resposta"}
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
