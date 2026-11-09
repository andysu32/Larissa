import { AvisoErro } from "@/components/AvisoErro";
import {
  ACOES_MODERACAO,
  MOTIVOS_DENUNCIA,
  historicoDoAlvo,
  listarFila,
  listarPapeis,
} from "@/lib/moderacao";
import { ehAdministrador, ehModerador } from "@/lib/regras";
import { getUsuarioAtual } from "@/lib/session";
import { formatarData } from "@/lib/texto";
import {
  acaoConcederPapel,
  acaoJulgarApelacao,
  acaoRegistrarDecisao,
  acaoRevogarPapel,
} from "./actions";

function rotuloMotivo(motivo: string): string {
  return MOTIVOS_DENUNCIA.find((item) => item.id === motivo)?.rotulo ?? motivo;
}

function rotuloAcao(acao: string): string {
  return ACOES_MODERACAO.find((item) => item.id === acao)?.rotulo ?? acao;
}

export default async function PaginaModeracao({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const usuario = await getUsuarioAtual();
  const { erro } = await searchParams;

  if (!usuario || !ehModerador(usuario.papeis)) {
    return (
      <div className="pagina">
        <h1>Moderação</h1>
        <p className="muted">A fila é restrita à moderação.</p>
      </div>
    );
  }

  const fila = await listarFila(usuario);
  const historicos = await Promise.all(
    fila.denuncias.map((denuncia) => historicoDoAlvo(denuncia.alvoTipo, denuncia.alvoId)),
  );
  const papeis = ehAdministrador(usuario.papeis) ? await listarPapeis(usuario) : [];

  return (
    <div className="pagina">
      <h1>Moderação</h1>
      <AvisoErro erro={erro} />

      <section className="pilha" aria-label="Denúncias abertas">
        <h2>Denúncias</h2>
        {fila.denuncias.length === 0 ? (
          <p className="muted">Nenhuma denúncia aberta no momento.</p>
        ) : (
          <ul className="lista">
            {fila.denuncias.map((denuncia, indice) => {
              const historico = historicos[indice];
              return (
                <li key={denuncia.id} className="cartao pilha">
                  <p>
                    <strong>{rotuloMotivo(denuncia.motivo)}</strong>
                  </p>
                  {denuncia.detalhe ? <p className="muted">{denuncia.detalhe}</p> : null}
                  <p className="meta">
                    Alvo: {denuncia.alvoTipo} · {denuncia.alvoId}
                  </p>
                  <p className="meta">
                    Denunciado por {denuncia.autorApelido} · {formatarData(denuncia.criadaEm)}
                  </p>

                  <form className="pilha" action={acaoRegistrarDecisao}>
                    <input type="hidden" name="denunciaId" value={denuncia.id} />
                    <input type="hidden" name="alvoTipo" value={denuncia.alvoTipo} />
                    <input type="hidden" name="alvoId" value={denuncia.alvoId} />
                    <div className="campo">
                      <label htmlFor={`acao-${denuncia.id}`}>Ação</label>
                      <select id={`acao-${denuncia.id}`} name="acao" required defaultValue="">
                        <option value="" disabled>
                          Escolha uma ação
                        </option>
                        {ACOES_MODERACAO.map((acao) => (
                          <option key={acao.id} value={acao.id}>
                            {acao.rotulo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="campo">
                      <label htmlFor={`motivo-${denuncia.id}`}>Motivo da decisão</label>
                      <textarea id={`motivo-${denuncia.id}`} name="motivo" rows={3} required />
                    </div>
                    <button className="btn btn-primary" type="submit">
                      Registrar decisão
                    </button>
                  </form>

                  {historico.revisoes.length > 0 || historico.acoes.length > 0 ? (
                    <div className="pilha">
                      {historico.revisoes.length > 0 ? (
                        <div>
                          <h3>Revisões</h3>
                          <ul className="lista">
                            {historico.revisoes.map((revisao) => (
                              <li key={revisao.id}>
                                <p>{revisao.resumo}</p>
                                <p className="meta">
                                  {revisao.editor} · {formatarData(revisao.criadaEm)}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {historico.acoes.length > 0 ? (
                        <div>
                          <h3>Ações anteriores</h3>
                          <ul className="lista">
                            {historico.acoes.map((acao) => (
                              <li key={acao.id}>
                                <p>
                                  <strong>{rotuloAcao(acao.acao)}</strong>
                                </p>
                                <p className="muted">{acao.motivo}</p>
                                <p className="meta">
                                  {acao.moderador} · {formatarData(acao.criadaEm)}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="pilha" aria-label="Apelações abertas">
        <h2>Apelações</h2>
        {fila.apelacoes.length === 0 ? (
          <p className="muted">Nenhuma apelação aberta no momento.</p>
        ) : (
          <ul className="lista">
            {fila.apelacoes.map((apelacao) => (
              <li key={apelacao.id} className="cartao pilha">
                <p>{apelacao.texto}</p>
                <p className="meta">
                  Ação anterior: {rotuloAcao(apelacao.acao)} · {apelacao.acaoMotivo}
                </p>
                <p className="meta">
                  Por {apelacao.autorApelido} · {formatarData(apelacao.criadaEm)}
                </p>

                {usuario.id === apelacao.moderadorId ? (
                  <p className="aviso" role="status">
                    Outra pessoa moderadora precisa julgar esta apelação.
                  </p>
                ) : (
                  <form className="pilha" action={acaoJulgarApelacao}>
                    <input type="hidden" name="apelacaoId" value={apelacao.id} />
                    <div className="campo">
                      <label htmlFor={`resultado-${apelacao.id}`}>Resultado</label>
                      <select id={`resultado-${apelacao.id}`} name="resultado" required defaultValue="">
                        <option value="" disabled>
                          Escolha o resultado
                        </option>
                        <option value="procedente">Procedente</option>
                        <option value="improcedente">Improcedente</option>
                      </select>
                    </div>
                    <div className="campo">
                      <label htmlFor={`texto-${apelacao.id}`}>Explicação</label>
                      <textarea id={`texto-${apelacao.id}`} name="texto" rows={3} required />
                    </div>
                    <button className="btn btn-primary" type="submit">
                      Julgar apelação
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {ehAdministrador(usuario.papeis) ? (
        <section className="pilha" aria-label="Papéis">
          <h2>Papéis</h2>
          <form className="pilha cartao" action={acaoConcederPapel}>
            <div className="campo">
              <label htmlFor="email-papel">E-mail</label>
              <input id="email-papel" name="email" type="email" required />
            </div>
            <div className="campo">
              <label htmlFor="papel">Papel</label>
              <select id="papel" name="papel" required defaultValue="especialista">
                <option value="especialista">Especialista</option>
                <option value="moderador">Moderador</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="areaSlug">Área (slug do mapa)</label>
              <input id="areaSlug" name="areaSlug" placeholder="matematica" />
            </div>
            <button className="btn btn-primary" type="submit">
              Conceder papel
            </button>
          </form>

          {papeis.length > 0 ? (
            <ul className="lista">
              {papeis.map((papel) => (
                <li key={papel.id} className="linha cartao">
                  <div className="pilha">
                    <p>
                      <strong>{papel.apelido}</strong>
                    </p>
                    <p className="meta">{papel.email}</p>
                    <p className="meta">
                      {papel.papel}
                      {papel.area ? ` · ${papel.area}` : null}
                    </p>
                  </div>
                  {papel.papel !== "administrador" ? (
                    <form action={acaoRevogarPapel}>
                      <input type="hidden" name="papelId" value={papel.id} />
                      <button className="btn btn-perigo" type="submit">
                        Revogar
                      </button>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Nenhum papel cadastrado.</p>
          )}
        </section>
      ) : null}
    </div>
  );
}
