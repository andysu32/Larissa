import Link from "next/link";
import { notFound } from "next/navigation";
import { AvisoErro } from "@/components/AvisoErro";
import { AvisoOk } from "@/components/AvisoOk";
import { obterComunidade } from "@/lib/comunidades";
import { MOTIVOS_DENUNCIA } from "@/lib/moderacao";
import { getUsuarioAtual } from "@/lib/session";
import { formatarData } from "@/lib/texto";
import {
  acaoComentar,
  acaoCriarEnquete,
  acaoCriarPublicacao,
  acaoDenunciarPublicacao,
  acaoEntrarComunidade,
  acaoVotarEnquete,
} from "./actions";

const ROTULO_ETIQUETA: Record<string, string> = {
  discussao: "Discussão",
  material: "Material",
  pergunta: "Pergunta",
  enquete: "Enquete",
};

export default async function PaginaComunidade({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ erro?: string; ok?: string }>;
}) {
  const { slug } = await params;
  const { erro, ok } = await searchParams;
  const usuario = await getUsuarioAtual();
  const comunidade = await obterComunidade(slug, usuario?.id ?? null);
  if (!comunidade) notFound();

  return (
    <div className="pagina">
      <p className="olho">Comunidade</p>
      <h1>{comunidade.nome}</h1>
      <p className="muted">{comunidade.descricao}</p>
      <AvisoErro erro={erro} />
      <AvisoOk mensagem={ok} />

      <section className="pilha cartao" aria-label="Regras da comunidade">
        <h2>Regras</h2>
        <p>{comunidade.regras}</p>
      </section>

      {!usuario ? (
        <p>
          <Link href={`/entrar?depois=/comunidades/${comunidade.slug}`}>Entre</Link> para participar desta
          comunidade.
        </p>
      ) : null}

      {usuario && !comunidade.souMembro ? (
        <form className="pilha cartao" action={acaoEntrarComunidade}>
          <input type="hidden" name="slug" value={comunidade.slug} />
          <p className="muted">Entre na comunidade para publicar, comentar e votar em enquetes.</p>
          <button className="btn btn-primary" type="submit">
            Entrar na comunidade
          </button>
        </form>
      ) : null}

      {comunidade.souMembro ? (
        <section className="pilha" aria-label="Participar">
          <h2>Participar</h2>
          <form className="pilha cartao" action={acaoCriarPublicacao}>
            <input type="hidden" name="slug" value={comunidade.slug} />
            <h3>Nova publicação</h3>
            <div className="campo">
              <label htmlFor="pub-titulo">Título</label>
              <input id="pub-titulo" name="titulo" required maxLength={140} />
            </div>
            <div className="campo">
              <label htmlFor="pub-corpo">Texto</label>
              <textarea id="pub-corpo" name="corpo" required rows={5} maxLength={5000} />
            </div>
            <div className="campo">
              <label htmlFor="pub-etiqueta">Tipo</label>
              <select id="pub-etiqueta" name="etiqueta" required defaultValue="discussao">
                <option value="discussao">Discussão</option>
                <option value="material">Material</option>
                <option value="pergunta">Pergunta</option>
              </select>
              <p className="muted">
                Para uma dúvida com verificação de resposta, use a área Perguntas.
              </p>
            </div>
            <button className="btn btn-primary" type="submit">
              Publicar
            </button>
          </form>

          <form className="pilha cartao" action={acaoCriarEnquete}>
            <input type="hidden" name="slug" value={comunidade.slug} />
            <h3>Nova enquete</h3>
            <p className="muted">A enquete não decide se um conteúdo está correto.</p>
            <div className="campo">
              <label htmlFor="enq-titulo">Título</label>
              <input id="enq-titulo" name="titulo" required maxLength={140} />
            </div>
            <div className="campo">
              <label htmlFor="enq-corpo">Texto (opcional)</label>
              <textarea id="enq-corpo" name="corpo" rows={3} maxLength={2000} />
            </div>
            <div className="campo">
              <label htmlFor="opcao1">Opção 1</label>
              <input id="opcao1" name="opcao1" required maxLength={80} />
            </div>
            <div className="campo">
              <label htmlFor="opcao2">Opção 2</label>
              <input id="opcao2" name="opcao2" required maxLength={80} />
            </div>
            <div className="campo">
              <label htmlFor="opcao3">Opção 3 (opcional)</label>
              <input id="opcao3" name="opcao3" maxLength={80} />
            </div>
            <div className="campo">
              <label htmlFor="opcao4">Opção 4 (opcional)</label>
              <input id="opcao4" name="opcao4" maxLength={80} />
            </div>
            <button className="btn btn-primary" type="submit">
              Criar enquete
            </button>
          </form>
        </section>
      ) : !usuario ? (
        <p className="aviso">
          <Link href="/entrar">Entre</Link> para participar desta comunidade.
        </p>
      ) : null}

      <section className="pilha" style={{ marginTop: "1.6rem" }} aria-label="Publicações">
        <div className="entre">
          <h2>Publicações</h2>
          <Link className="btn btn-ghost" href="/comunidades">
            Todas as comunidades
          </Link>
        </div>

        {comunidade.publicacoes.length === 0 ? (
          <p className="muted">Ainda não há publicações aqui.</p>
        ) : (
          <ul className="lista">
            {comunidade.publicacoes.map((publicacao) => (
              <li key={publicacao.id}>
                <article className="cartao pilha">
                  <h3>{publicacao.titulo}</h3>
                  <p className="meta">
                    {publicacao.autor} · {formatarData(publicacao.criadaEm)} ·{" "}
                    {ROTULO_ETIQUETA[publicacao.etiqueta] ?? publicacao.etiqueta}
                  </p>
                  <p>{publicacao.corpo}</p>

                  {publicacao.enquete ? (
                    <div className="pilha" aria-label="Opções da enquete">
                      {comunidade.souMembro ? (
                        publicacao.enquete.opcoes.map((opcao) => (
                          <form key={opcao.id} className="linha" action={acaoVotarEnquete}>
                            <input type="hidden" name="slug" value={comunidade.slug} />
                            <input type="hidden" name="enqueteId" value={publicacao.enquete!.id} />
                            <input type="hidden" name="opcaoId" value={opcao.id} />
                            <button className="btn btn-ghost" type="submit">
                              {opcao.texto} · {opcao.votos}{" "}
                              {opcao.votos === 1 ? "voto" : "votos"}
                              {publicacao.enquete!.minhaOpcaoId === opcao.id ? " · Sua escolha" : ""}
                            </button>
                          </form>
                        ))
                      ) : (
                        <ul className="lista">
                          {publicacao.enquete.opcoes.map((opcao) => (
                            <li key={opcao.id} className="meta">
                              {opcao.texto} · {opcao.votos} {opcao.votos === 1 ? "voto" : "votos"}
                              {publicacao.enquete!.minhaOpcaoId === opcao.id ? " · Sua escolha" : ""}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : null}

                  {publicacao.comentarios.length > 0 ? (
                    <ul className="lista" aria-label="Comentários">
                      {publicacao.comentarios.map((comentario) => (
                        <li key={comentario.id}>
                          <p>
                            <strong>{comentario.autor}</strong>
                          </p>
                          <p className="meta">{formatarData(comentario.criadaEm)}</p>
                          <p>{comentario.corpo}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted">Nenhum comentário ainda.</p>
                  )}

                  {comunidade.souMembro ? (
                    <form className="pilha" action={acaoComentar}>
                      <input type="hidden" name="slug" value={comunidade.slug} />
                      <input type="hidden" name="publicacaoId" value={publicacao.id} />
                      <div className="campo">
                        <label htmlFor={`comentario-${publicacao.id}`}>Comentar</label>
                        <textarea
                          id={`comentario-${publicacao.id}`}
                          name="corpo"
                          required
                          rows={3}
                          maxLength={2000}
                        />
                      </div>
                      <button className="btn btn-primary" type="submit">
                        Enviar comentário
                      </button>
                    </form>
                  ) : !usuario ? (
                    <p className="muted">
                      <Link href="/entrar">Entre</Link> para comentar.
                    </p>
                  ) : null}

                  {usuario ? (
                    <form className="pilha" action={acaoDenunciarPublicacao}>
                      <input type="hidden" name="slug" value={comunidade.slug} />
                      <input type="hidden" name="alvoId" value={publicacao.id} />
                      <h4>Denunciar publicação</h4>
                      <div className="campo">
                        <label htmlFor={`motivo-${publicacao.id}`}>Motivo</label>
                        <select id={`motivo-${publicacao.id}`} name="motivo" required defaultValue="">
                          <option value="" disabled>
                            Escolha o motivo
                          </option>
                          {MOTIVOS_DENUNCIA.map((motivo) => (
                            <option key={motivo.id} value={motivo.id}>
                              {motivo.rotulo}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="campo">
                        <label htmlFor={`detalhe-${publicacao.id}`}>Detalhe (opcional)</label>
                        <textarea
                          id={`detalhe-${publicacao.id}`}
                          name="detalhe"
                          rows={2}
                          maxLength={500}
                        />
                      </div>
                      <button className="btn btn-ghost" type="submit">
                        Enviar denúncia
                      </button>
                    </form>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
