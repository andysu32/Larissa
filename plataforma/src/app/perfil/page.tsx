import { redirect } from "next/navigation";
import { AvisoErro } from "@/components/AvisoErro";
import { obterMinhaConta } from "@/lib/contas";
import { eventosRecentes } from "@/lib/reputacao";
import { acoesContra } from "@/lib/moderacao";
import { getUsuarioAtual } from "@/lib/session";
import { formatarData } from "@/lib/texto";
import { acaoApelar, acaoAtualizarPerfil } from "./actions";

function inicialApelido(apelido: string): string {
  const letra = apelido.trim().charAt(0);
  return letra ? letra.toUpperCase() : "?";
}

function resumoDeltas(
  deltaPrecisao: number,
  deltaClareza: number,
  deltaContribuicao: number,
): string {
  const partes: string[] = [];
  if (deltaPrecisao !== 0) partes.push(`Precisão ${deltaPrecisao > 0 ? "+" : ""}${deltaPrecisao}`);
  if (deltaClareza !== 0) partes.push(`Clareza ${deltaClareza > 0 ? "+" : ""}${deltaClareza}`);
  if (deltaContribuicao !== 0) {
    partes.push(`Contribuição ${deltaContribuicao > 0 ? "+" : ""}${deltaContribuicao}`);
  }
  return partes.length > 0 ? partes.join(" · ") : "Sem alteração nos índices";
}

export default async function PaginaPerfil({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/entrar");

  const { erro } = await searchParams;
  const conta = await obterMinhaConta(usuario.id);
  if (!conta) redirect("/entrar");

  const [eventos, acoes] = await Promise.all([
    eventosRecentes(usuario.id),
    acoesContra(usuario.id),
  ]);

  return (
    <div className="pagina">
      <h1>Meu perfil</h1>
      <AvisoErro erro={erro} />

      <div className="linha cartao">
        <span className="avatar" aria-hidden="true">
          {inicialApelido(conta.apelido)}
        </span>
        <div className="pilha">
          <p>
            <strong>{conta.nome}</strong>
          </p>
          <p className="meta">{conta.email}</p>
        </div>
      </div>

      {conta.restrito ? (
        <p className="aviso" role="status">
          Conta restrita: nome, objetivos, progresso e reputação permanecem fora do perfil público.
        </p>
      ) : null}

      <section className="pilha" aria-label="Reputação">
        <h2>Reputação</h2>
        <ul className="lista pilha">
          <li className="cartao">
            <p>
              <strong>{conta.precisao}</strong>
            </p>
            <p className="muted">
              Precisão: sobe quando uma resposta é verificada e cai quando é marcada incorreta. Não vem de
              curtidas.
            </p>
          </li>
          <li className="cartao">
            <p>
              <strong>{conta.clareza}</strong>
            </p>
            <p className="muted">Clareza: alguém disse que a explicação ajudou a entender.</p>
          </li>
          <li className="cartao">
            <p>
              <strong>{conta.contribuicao}</strong>
            </p>
            <p className="muted">Contribuição: perguntas, respostas e participação útil.</p>
          </li>
        </ul>
      </section>

      <form className="pilha cartao" action={acaoAtualizarPerfil}>
        <h2>Privacidade e apresentação</h2>
        <div className="campo">
          <label htmlFor="apelido">Apelido público</label>
          <input id="apelido" name="apelido" defaultValue={conta.apelido} required />
        </div>
        <div className="campo">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" defaultValue={conta.bio} rows={4} />
        </div>
        <div className="campo">
          <label htmlFor="tamanhoFonte">Tamanho da fonte</label>
          <select id="tamanhoFonte" name="tamanhoFonte" defaultValue={conta.tamanhoFonte}>
            <option value="sm">Menor</option>
            <option value="md">Padrão</option>
            <option value="lg">Maior</option>
          </select>
        </div>
        <label className="cheque">
          <input name="mostrarNome" type="checkbox" defaultChecked={conta.mostrarNome} />
          Mostrar meu nome no perfil público
        </label>
        <label className="cheque">
          <input name="mostrarAreas" type="checkbox" defaultChecked={conta.mostrarAreas} />
          Mostrar áreas de estudo no perfil público
        </label>
        <label className="cheque">
          <input name="mostrarReputacao" type="checkbox" defaultChecked={conta.mostrarReputacao} />
          Mostrar reputação no perfil público
        </label>
        <label className="cheque">
          <input name="mostrarObjetivos" type="checkbox" defaultChecked={conta.mostrarObjetivos} />
          Mostrar objetivo de estudo no perfil público
        </label>
        <label className="cheque">
          <input name="mostrarProgresso" type="checkbox" defaultChecked={conta.mostrarProgresso} />
          Mostrar progresso no perfil público
        </label>
        <label className="cheque">
          <input name="mostrarComunidades" type="checkbox" defaultChecked={conta.mostrarComunidades} />
          Mostrar comunidades no perfil público
        </label>
        <button className="btn btn-primary" type="submit">
          Salvar alterações
        </button>
      </form>

      <section className="pilha" aria-label="Eventos recentes de reputação">
        <h2>Eventos recentes</h2>
        {eventos.length === 0 ? (
          <p className="muted">Ainda não há eventos registrados na sua reputação.</p>
        ) : (
          <ul className="lista">
            {eventos.map((evento) => (
              <li key={evento.id} className="cartao">
                <p>{evento.detalhe}</p>
                <p className="meta">{resumoDeltas(evento.deltaPrecisao, evento.deltaClareza, evento.deltaContribuicao)}</p>
                <p className="muted">{formatarData(evento.criadoEm)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="pilha" aria-label="Decisões de moderação">
        <h2>Decisões que te afetaram</h2>
        {acoes.length === 0 ? (
          <p className="muted">Nenhuma decisão registrada contra o seu conteúdo.</p>
        ) : (
          <ul className="lista">
            {acoes.map((item) => (
              <li key={item.id} className="cartao pilha">
                <p>
                  <strong>{item.acao}</strong> · {item.alvoTipo}
                </p>
                <p className="muted">{item.motivo}</p>
                <p className="meta">{formatarData(item.criadaEm)}</p>
                {item.apelacaoAberta ? (
                  <p className="muted">Há uma apelação em análise.</p>
                ) : (
                  <form className="pilha" action={acaoApelar}>
                    <input name="acaoId" type="hidden" value={item.id} />
                    <div className="campo">
                      <label htmlFor={`apelacao-${item.id}`}>Texto da apelação</label>
                      <textarea id={`apelacao-${item.id}`} name="texto" rows={3} required />
                    </div>
                    <button className="btn btn-ghost" type="submit">
                      Enviar apelação
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
