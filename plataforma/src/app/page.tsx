import Link from "next/link";
import { arvoreConhecimento } from "@/lib/arvore";
import { listarComunidades } from "@/lib/comunidades";
import { listarPerguntas } from "@/lib/perguntas";
import { ROTULO_DIFICULDADE, ROTULO_ESTADO } from "@/lib/rotulos";

export default async function Inicio() {
  const [perguntas, comunidades, mapa] = await Promise.all([
    listarPerguntas(4),
    listarComunidades(),
    arvoreConhecimento(),
  ]);

  return (
    <div className="pagina">
      <section className="hero">
        <p className="olho">Educação aberta</p>
        <h1>Aprenda. Ensine. Compartilhe. Evolua.</h1>
        <p className="subtitulo">
          Um lugar para estudar, perguntar e ajudar outras pessoas. A resposta mais aplaudida não vira gabarito:
          correção exige revisão e explicação.
        </p>
        <form className="busca" action="/busca" method="get" role="search">
          <div className="campo">
            <label htmlFor="q">Pesquisar perguntas, pessoas e comunidades</label>
            <input id="q" name="q" placeholder="Por exemplo: vértice da função quadrática" />
          </div>
          <button type="submit">Buscar</button>
        </form>
      </section>

      <section className="grade" aria-label="Por onde começar">
        <Link className="cartao-link" href="/perguntas/nova">
          <h2>Fazer uma pergunta</h2>
          <p className="muted">Classifique a dúvida por assunto, nível e objetivo.</p>
        </Link>
        <Link className="cartao-link" href="/comunidades">
          <h2>Entrar numa comunidade</h2>
          <p className="muted">Converse com gente que estuda o mesmo caminho.</p>
        </Link>
        <Link className="cartao-link" href="/mapa">
          <h2>Ver o mapa</h2>
          <p className="muted">
            {mapa.map((no) => no.nome).join(", ") || "O mapa de conhecimento aparece aqui."}
          </p>
        </Link>
        <Link className="cartao-link" href="/progresso">
          <h2>Registrar o objetivo</h2>
          <p className="muted">Diga o que você está estudando. A trilha automática vem depois.</p>
        </Link>
      </section>

      <section className="pilha" style={{ marginTop: "1.6rem" }}>
        <div className="entre">
          <h2>Perguntas recentes</h2>
          <Link href="/perguntas">Ver todas</Link>
        </div>
        {perguntas.length === 0 ? (
          <p className="muted">Ainda não há perguntas. A primeira pode ser a sua.</p>
        ) : (
          <ul className="lista">
            {perguntas.map((pergunta) => (
              <li key={pergunta.id}>
                <Link className="cartao-link" href={`/perguntas/${pergunta.id}`}>
                  <h3>{pergunta.titulo}</h3>
                  <p className="meta">
                    {pergunta.autor} · {ROTULO_DIFICULDADE[pergunta.dificuldade] ?? pergunta.dificuldade} ·{" "}
                    {pergunta.totalRespostas} respostas
                    {pergunta.melhorEstado
                      ? ` · ${ROTULO_ESTADO[pergunta.melhorEstado] ?? pergunta.melhorEstado}`
                      : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="pilha" style={{ marginTop: "1.6rem" }}>
        <h2>Comunidades</h2>
        <div className="grade">
          {comunidades.map((comunidade) => (
            <Link className="cartao-link" key={comunidade.slug} href={`/comunidades/${comunidade.slug}`}>
              <h3>{comunidade.nome}</h3>
              <p className="muted">{comunidade.descricao}</p>
            </Link>
          ))}
        </div>
      </section>

      {process.env.NODE_ENV !== "production" ? (
        <aside className="cartao" style={{ marginTop: "1.6rem" }}>
          <h2>Acesso local de demonstração</h2>
          <p className="muted">
            Estudante: ana@aprenda.local · Moderação, também especialista em Matemática:
            moderacao@aprenda.local · Senha das duas contas: aprenda-local
          </p>
        </aside>
      ) : null}
    </div>
  );
}
