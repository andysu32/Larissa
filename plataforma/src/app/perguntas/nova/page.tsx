import Link from "next/link";
import { AvisoErro } from "@/components/AvisoErro";
import { nosParaSelecao } from "@/lib/arvore";
import { DIFICULDADES, NIVEIS, ROTULO_DIFICULDADE, ROTULO_NIVEL } from "@/lib/rotulos";
import { getUsuarioAtual } from "@/lib/session";
import { acaoCriarPergunta } from "./actions";

export default async function PaginaNovaPergunta({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const [{ erro }, usuario, nos] = await Promise.all([searchParams, getUsuarioAtual(), nosParaSelecao()]);

  return (
    <div className="pagina">
      <p className="olho">Classifique a dúvida</p>
      <h1>Nova pergunta</h1>
      <AvisoErro erro={erro} />

      {!usuario ? (
        <p className="muted">
          Para publicar uma pergunta, <Link href="/entrar">entre na sua conta</Link>.
        </p>
      ) : (
        <form className="pilha cartao" action={acaoCriarPergunta}>
          <div className="campo">
            <label htmlFor="titulo">Título</label>
            <input id="titulo" name="titulo" required minLength={12} maxLength={140} />
          </div>
          <div className="campo">
            <label htmlFor="corpo">Detalhes da dúvida</label>
            <textarea id="corpo" name="corpo" required minLength={20} maxLength={5000} rows={8} />
          </div>
          <div className="grade">
            <div className="campo">
              <label htmlFor="dificuldade">Dificuldade</label>
              <select id="dificuldade" name="dificuldade" required defaultValue="">
                <option value="" disabled>
                  Escolha
                </option>
                {DIFICULDADES.map((valor) => (
                  <option key={valor} value={valor}>
                    {ROTULO_DIFICULDADE[valor]}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="nivelEducacional">Nível educacional</label>
              <select id="nivelEducacional" name="nivelEducacional" required defaultValue="">
                <option value="" disabled>
                  Escolha
                </option>
                {NIVEIS.map((valor) => (
                  <option key={valor} value={valor}>
                    {ROTULO_NIVEL[valor]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="campo">
            <label htmlFor="objetivo">Objetivo</label>
            <input id="objetivo" name="objetivo" required minLength={2} maxLength={120} />
          </div>
          <div className="campo">
            <label htmlFor="noId">Assunto no mapa</label>
            <select id="noId" name="noId" required defaultValue="">
              <option value="" disabled>
                Escolha
              </option>
              {nos.map((no) => (
                <option key={no.id} value={no.id}>
                  {no.trilha}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit">
            Publicar pergunta
          </button>
        </form>
      )}
    </div>
  );
}
