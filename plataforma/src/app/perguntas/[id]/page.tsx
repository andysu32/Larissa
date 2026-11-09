import Link from "next/link";
import { notFound } from "next/navigation";
import { AvisoErro } from "@/components/AvisoErro";
import { AvisoOk } from "@/components/AvisoOk";
import { EstadoSelo } from "@/components/EstadoSelo";
import { MOTIVOS_DENUNCIA } from "@/lib/moderacao";
import { ROTULO_DIFICULDADE, ROTULO_ESTADO, ROTULO_NIVEL } from "@/lib/rotulos";
import { obterPergunta } from "@/lib/respostas";
import { getUsuarioAtual } from "@/lib/session";
import { formatarData } from "@/lib/texto";
import { opcoesParaResposta } from "@/lib/veredito";
import {
  acaoAplicarVeredito,
  acaoCriarResposta,
  acaoDenunciar,
  acaoEditarResposta,
  acaoVotarClareza,
} from "./actions";

function FormularioDenuncia({
  perguntaId,
  alvoTipo,
  alvoId,
  rotulo,
}: {
  perguntaId: string;
  alvoTipo: string;
  alvoId: string;
  rotulo: string;
}) {
  return (
    <details className="recolhido">
      <summary>{rotulo}</summary>
      <form className="pilha" action={acaoDenunciar}>
        <input type="hidden" name="perguntaId" value={perguntaId} />
        <input type="hidden" name="alvoTipo" value={alvoTipo} />
        <input type="hidden" name="alvoId" value={alvoId} />
        <div className="campo">
          <label htmlFor={`motivo-${alvoId}`}>Motivo</label>
          <select id={`motivo-${alvoId}`} name="motivo" required defaultValue="">
            <option value="" disabled>
              Escolha
            </option>
            {MOTIVOS_DENUNCIA.map((motivo) => (
              <option key={motivo.id} value={motivo.id}>
                {motivo.rotulo}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor={`detalhe-${alvoId}`}>Detalhe (opcional)</label>
          <textarea id={`detalhe-${alvoId}`} name="detalhe" maxLength={500} rows={3} />
        </div>
        <button className="btn btn-ghost" type="submit">
          Enviar denúncia
        </button>
      </form>
    </details>
  );
}

export default async function PaginaPergunta({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string; ok?: string }>;
}) {
  const { id } = await params;
  const { erro, ok } = await searchParams;
  const usuario = await getUsuarioAtual();
  const pergunta = await obterPergunta(id, usuario);
  if (!pergunta) notFound();

  const opcoesMapa = usuario
    ? Object.fromEntries(
        await Promise.all(
          pergunta.respostas.map(async (resposta) => [
            resposta.id,
            await opcoesParaResposta(usuario, resposta.id),
          ]),
        ),
      )
    : {};

  const respostasOrdenadas = [...pergunta.respostas].sort((a, b) => {
    const ordem = [
      "verificada_especialista",
      "correta",
      "parcialmente_correta",
      "revisao_humana",
      "em_analise",
      "nao_verificada",
      "incorreta",
    ];
    const diferenca = ordem.indexOf(a.estado) - ordem.indexOf(b.estado);
    if (diferenca !== 0) return diferenca;
    return a.criadaEm.getTime() - b.criadaEm.getTime();
  });

  return (
    <div className="pagina">
      <p className="olho">
        <Link href="/perguntas">Perguntas</Link>
      </p>
      <h1>{pergunta.titulo}</h1>
      <AvisoErro erro={erro} />
      <AvisoOk mensagem={ok} />

      <article className="cartao pilha">
        <p className="meta">
          <Link href={`/pessoas/${pergunta.autorId}`}>{pergunta.autor}</Link> · {formatarData(pergunta.criadaEm)}
        </p>
        <p className="meta">
          {ROTULO_DIFICULDADE[pergunta.dificuldade] ?? pergunta.dificuldade} ·{" "}
          {ROTULO_NIVEL[pergunta.nivelEducacional] ?? pergunta.nivelEducacional} · {pergunta.objetivo}
        </p>
        {pergunta.assuntos.length > 0 ? (
          <p className="muted">
            Assuntos:{" "}
            {pergunta.assuntos.map((item, indice) => (
              <span key={item.id}>
                {indice > 0 ? " · " : null}
                <Link href={`/perguntas?assunto=${item.slug}`}>{item.nome}</Link>
              </span>
            ))}
          </p>
        ) : null}
        <p style={{ whiteSpace: "pre-wrap" }}>{pergunta.corpo}</p>
      </article>

      <p className="aviso" style={{ marginTop: "1.2rem" }}>
        Uma resposta não fica correta porque recebeu votos. O voto abaixo só diz se a explicação ajudou a entender.
      </p>

      <FormularioDenuncia
        perguntaId={pergunta.id}
        alvoTipo="pergunta"
        alvoId={pergunta.id}
        rotulo="Denunciar esta pergunta"
      />

      <section className="pilha" style={{ marginTop: "1.6rem" }}>
        <h2>Respostas</h2>
        {pergunta.respostas.length === 0 ? (
          <p className="muted">Ninguém respondeu ainda.</p>
        ) : (
          respostasOrdenadas.map((resposta) => {
            const opcoes: string[] = opcoesMapa[resposta.id] ?? [];
            const souAutor = usuario?.id === resposta.autorId;
            const possoVotar = usuario && !souAutor;

            return (
              <article key={resposta.id} className="cartao pilha">
                <EstadoSelo estado={resposta.estado} />
                <p className="meta">
                  {resposta.autor} · {formatarData(resposta.criadaEm)}
                </p>
                <p style={{ whiteSpace: "pre-wrap" }}>{resposta.corpo}</p>

                {resposta.fontes.length > 0 ? (
                  <ul className="lista">
                    {resposta.fontes.map((fonte, indice) => (
                      <li key={indice}>
                        <strong>{fonte.titulo}</strong>
                        {fonte.url.startsWith("http") ? (
                          <>
                            {" · "}
                            <a href={fonte.url} rel="noreferrer">
                              {fonte.url}
                            </a>
                          </>
                        ) : fonte.url ? (
                          <span className="muted"> · {fonte.url}</span>
                        ) : null}
                        {fonte.citacao ? <p className="muted">{fonte.citacao}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {resposta.parecer ? (
                  <p className="aviso">
                    Parecer automático, sem valor de gabarito: {resposta.parecer.texto}
                  </p>
                ) : null}

                {resposta.explicacaoVeredito ? (
                  <p className="ok">Por que este veredito: {resposta.explicacaoVeredito}</p>
                ) : null}

                {resposta.votosApoio > 0 ? (
                  <p className="muted">
                    {resposta.votosApoio}{" "}
                    {resposta.votosApoio === 1 ? "pessoa marcou como claro" : "pessoas marcaram como claro"}
                  </p>
                ) : null}

                {possoVotar ? (
                  <div className="linha">
                    <form action={acaoVotarClareza}>
                      <input type="hidden" name="perguntaId" value={pergunta.id} />
                      <input type="hidden" name="respostaId" value={resposta.id} />
                      <input type="hidden" name="valor" value="1" />
                      <button className="btn btn-ghost" type="submit" aria-pressed={resposta.meuVoto === 1}>
                        Isto me ajudou a entender
                      </button>
                    </form>
                    <form action={acaoVotarClareza}>
                      <input type="hidden" name="perguntaId" value={pergunta.id} />
                      <input type="hidden" name="respostaId" value={resposta.id} />
                      <input type="hidden" name="valor" value="-1" />
                      <button className="btn btn-ghost" type="submit" aria-pressed={resposta.meuVoto === -1}>
                        Isto ficou confuso
                      </button>
                    </form>
                  </div>
                ) : null}

                {souAutor ? (
                  <form className="pilha" action={acaoEditarResposta}>
                    <input type="hidden" name="perguntaId" value={pergunta.id} />
                    <input type="hidden" name="respostaId" value={resposta.id} />
                    <div className="campo">
                      <label htmlFor={`editar-${resposta.id}`}>Editar resposta</label>
                      <textarea id={`editar-${resposta.id}`} name="corpo" defaultValue={resposta.corpo} rows={6} required />
                    </div>
                    <button className="btn btn-primary" type="submit">
                      Salvar edição
                    </button>
                  </form>
                ) : null}

                {opcoes.length > 0 ? (
                  <form className="pilha" action={acaoAplicarVeredito}>
                    <input type="hidden" name="perguntaId" value={pergunta.id} />
                    <input type="hidden" name="respostaId" value={resposta.id} />
                    <div className="campo">
                      <label htmlFor={`estado-${resposta.id}`}>Registrar veredito</label>
                      <select id={`estado-${resposta.id}`} name="estado" required defaultValue="">
                        <option value="" disabled>
                          Escolha o estado
                        </option>
                        {opcoes.map((estado) => (
                          <option key={estado} value={estado}>
                            {ROTULO_ESTADO[estado] ?? estado}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="campo">
                      <label htmlFor={`explicacao-${resposta.id}`}>Explicação</label>
                      <textarea id={`explicacao-${resposta.id}`} name="explicacao" rows={4} required />
                    </div>
                    <button className="btn btn-primary" type="submit">
                      Registrar veredito
                    </button>
                  </form>
                ) : usuario && !souAutor ? (
                  <p className="muted">Você pode contribuir, mas não fechar este veredito.</p>
                ) : null}

                <FormularioDenuncia
                  perguntaId={pergunta.id}
                  alvoTipo="resposta"
                  alvoId={resposta.id}
                  rotulo="Denunciar esta resposta"
                />
              </article>
            );
          })
        )}
      </section>

      {usuario ? (
        <section className="pilha cartao" style={{ marginTop: "1.6rem" }}>
          <h2>Nova resposta</h2>
          <p className="muted">Escreva com suas palavras e cite a fonte quando usar uma.</p>
          <form className="pilha" action={acaoCriarResposta}>
            <input type="hidden" name="perguntaId" value={pergunta.id} />
            <div className="campo">
              <label htmlFor="corpo-resposta">Sua resposta</label>
              <textarea id="corpo-resposta" name="corpo" required minLength={20} rows={8} />
            </div>
            <div className="grade">
              <div className="campo">
                <label htmlFor="fonteTitulo">Título da fonte</label>
                <input id="fonteTitulo" name="fonteTitulo" />
              </div>
              <div className="campo">
                <label htmlFor="fonteUrl">URL da fonte</label>
                <input id="fonteUrl" name="fonteUrl" type="url" />
              </div>
            </div>
            <div className="campo">
              <label htmlFor="fonteCitacao">Citação</label>
              <textarea id="fonteCitacao" name="fonteCitacao" rows={2} />
            </div>
            <button className="btn btn-primary" type="submit">
              Publicar resposta
            </button>
          </form>
        </section>
      ) : (
        <p className="muted" style={{ marginTop: "1.6rem" }}>
          <Link href={`/entrar?depois=/perguntas/${pergunta.id}`}>Entre</Link> para responder. A resposta nasce em
          revisão humana e não vira gabarito sozinha.
        </p>
      )}
    </div>
  );
}
