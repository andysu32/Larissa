import Link from "next/link";
import { AvisoErro } from "@/components/AvisoErro";
import { resumoProgresso } from "@/lib/progresso";
import { getUsuarioAtual } from "@/lib/session";
import { acaoSalvarObjetivo } from "./actions";

export default async function PaginaProgresso({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const usuario = await getUsuarioAtual();
  const { erro } = await searchParams;

  if (!usuario) {
    return (
      <div className="pagina">
        <h1>Progresso</h1>
        <p className="muted">Entre na sua conta para ver perguntas, respostas e o seu objetivo de estudo.</p>
        <p>
          <Link className="btn btn-primary" href="/entrar">
            Entrar
          </Link>
        </p>
      </div>
    );
  }

  const resumo = await resumoProgresso(usuario.id);
  const objetivo = resumo.objetivo;

  return (
    <div className="pagina">
      <h1>Progresso</h1>
      <AvisoErro erro={erro} />

      <section className="grade" aria-label="Números">
        <div className="cartao">
          <p className="olho">Perguntas</p>
          <p>
            <strong>{resumo.perguntas}</strong>
          </p>
        </div>
        <div className="cartao">
          <p className="olho">Respostas</p>
          <p>
            <strong>{resumo.respostas}</strong>
          </p>
        </div>
        <div className="cartao">
          <p className="olho">Verificadas</p>
          <p>
            <strong>{resumo.verificadas}</strong>
          </p>
          <p className="muted">respostas com veredito positivo, não curtidas.</p>
        </div>
      </section>

      {resumo.assuntos.length > 0 ? (
        <section className="pilha" aria-label="Assuntos">
          <h2>Assuntos que você já tocou</h2>
          <ul className="lista">
            {resumo.assuntos.map((assunto) => (
              <li key={assunto}>{assunto}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="pilha cartao" aria-label="Objetivo de estudo">
        <h2>Objetivo de estudo</h2>
        <p className="muted">
          Isto guarda o seu objetivo. A trilha automática de estudos ainda não está pronta.
        </p>
        <form className="pilha" action={acaoSalvarObjetivo}>
          <div className="campo">
            <label htmlFor="descricao">Descrição</label>
            <input
              id="descricao"
              name="descricao"
              required
              defaultValue={objetivo?.descricao ?? ""}
            />
          </div>
          <div className="campo">
            <label htmlFor="nivel">Nível</label>
            <input id="nivel" name="nivel" defaultValue={objetivo?.nivel ?? ""} />
          </div>
          <div className="campo">
            <label htmlFor="prova">Prova ou foco</label>
            <input id="prova" name="prova" defaultValue={objetivo?.prova ?? ""} />
          </div>
          <div className="campo">
            <label htmlFor="minutosPorDia">Minutos por dia</label>
            <input
              id="minutosPorDia"
              name="minutosPorDia"
              type="number"
              min={0}
              max={720}
              defaultValue={objetivo?.minutosPorDia ?? ""}
            />
          </div>
          <div className="campo">
            <label htmlFor="dificuldades">Dificuldades</label>
            <textarea
              id="dificuldades"
              name="dificuldades"
              rows={4}
              defaultValue={objetivo?.dificuldades ?? ""}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Guardar objetivo
          </button>
        </form>
      </section>
    </div>
  );
}
