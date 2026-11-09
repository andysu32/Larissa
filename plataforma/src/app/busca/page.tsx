import Link from "next/link";
import { EstadoSelo } from "@/components/EstadoSelo";
import { buscar } from "@/lib/busca";

export default async function PaginaBusca({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const resultado = await buscar(q ?? "");

  const vazio =
    !resultado.aviso &&
    resultado.perguntas.length === 0 &&
    resultado.respostas.length === 0 &&
    resultado.comunidades.length === 0 &&
    resultado.pessoas.length === 0 &&
    resultado.nos.length === 0;

  return (
    <div className="pagina">
      <h1>Busca</h1>
      <form className="busca" action="/busca" method="get" role="search">
        <div className="campo">
          <label htmlFor="q">Pesquisar</label>
          <input id="q" name="q" defaultValue={resultado.termo} />
        </div>
        <button className="btn btn-primary" type="submit">
          Buscar
        </button>
      </form>

      {resultado.aviso ? (
        <p className="aviso" role="status">
          {resultado.aviso}
        </p>
      ) : null}

      {vazio ? <p className="muted">Nada encontrado com esses termos.</p> : null}

      {resultado.perguntas.length > 0 ? (
        <section className="pilha" aria-label="Perguntas">
          <h2>Perguntas</h2>
          <ul className="lista">
            {resultado.perguntas.map((pergunta) => (
              <li key={pergunta.id} className="cartao">
                <Link href={`/perguntas/${pergunta.id}`}>
                  <strong>{pergunta.titulo}</strong>
                </Link>
                <p className="muted">{pergunta.trecho}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resultado.respostas.length > 0 ? (
        <section className="pilha" aria-label="Respostas">
          <h2>Respostas</h2>
          <ul className="lista">
            {resultado.respostas.map((resposta) => (
              <li key={resposta.id} className="cartao">
                <div className="entre">
                  <Link href={`/perguntas/${resposta.perguntaId}`}>
                    <strong>{resposta.perguntaTitulo}</strong>
                  </Link>
                  <EstadoSelo estado={resposta.estado} />
                </div>
                <p className="muted">{resposta.trecho}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resultado.comunidades.length > 0 ? (
        <section className="pilha" aria-label="Comunidades">
          <h2>Comunidades</h2>
          <ul className="lista">
            {resultado.comunidades.map((comunidade) => (
              <li key={comunidade.slug} className="cartao">
                <Link href={`/comunidades/${comunidade.slug}`}>
                  <strong>{comunidade.nome}</strong>
                </Link>
                <p className="muted">{comunidade.descricao}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resultado.pessoas.length > 0 ? (
        <section className="pilha" aria-label="Pessoas">
          <h2>Pessoas</h2>
          <ul className="lista">
            {resultado.pessoas.map((pessoa) => (
              <li key={pessoa.id} className="cartao">
                <Link href={`/pessoas/${pessoa.id}`}>
                  <strong>{pessoa.nomeVisivel}</strong>
                </Link>
                {pessoa.precisao !== null ? (
                  <p className="meta">
                    Precisão <strong>{pessoa.precisao}</strong>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resultado.nos.length > 0 ? (
        <section className="pilha" aria-label="Mapa">
          <h2>Mapa</h2>
          <ul className="lista">
            {resultado.nos.map((no) => (
              <li key={no.slug} className="cartao">
                <Link href="/mapa">
                  <strong>{no.nome}</strong>
                </Link>
                <p className="meta">{no.tipo}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
