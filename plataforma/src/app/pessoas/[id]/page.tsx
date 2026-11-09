import Link from "next/link";
import { notFound } from "next/navigation";
import { obterPerfilPublico } from "@/lib/contas";

export default async function PaginaPessoaPublica({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const perfil = await obterPerfilPublico(id);
  if (!perfil) notFound();

  return (
    <div className="pagina">
      <h1>{perfil.nome}</h1>

      {perfil.bio ? <p className="subtitulo">{perfil.bio}</p> : null}

      <section className="pilha cartao" aria-label="Reputação">
        <h2>Reputação</h2>
        {perfil.reputacao ? (
          <p className="meta">
            Precisão {perfil.reputacao.precisao} · Clareza {perfil.reputacao.clareza} · Contribuição{" "}
            {perfil.reputacao.contribuicao}
          </p>
        ) : (
          <p className="muted">Reputação privada</p>
        )}
      </section>

      {perfil.areas.length > 0 ? (
        <section className="pilha" aria-label="Áreas de estudo">
          <h2>Áreas</h2>
          <ul className="lista">
            {perfil.areas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {perfil.objetivo ? (
        <section className="pilha cartao">
          <h2>Objetivo de estudo</h2>
          <p>{perfil.objetivo}</p>
        </section>
      ) : null}

      {perfil.progresso ? (
        <section className="pilha cartao">
          <h2>Progresso</h2>
          <p className="meta">
            {perfil.progresso.perguntas} perguntas · {perfil.progresso.respostas} respostas
          </p>
        </section>
      ) : null}

      {perfil.comunidades.length > 0 ? (
        <section className="pilha" aria-label="Comunidades">
          <h2>Comunidades</h2>
          <ul className="lista">
            {perfil.comunidades.map((comunidade) => (
              <li key={comunidade.slug}>
                <Link href={`/comunidades/${comunidade.slug}`}>{comunidade.nome}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
