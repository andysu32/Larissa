import Link from "next/link";
import { AvisoErro } from "@/components/AvisoErro";
import { arvoreConhecimento, type NoArvore } from "@/lib/arvore";
import { listarLivros, ROTULO_ACESSO } from "@/lib/biblioteca";

const ACESSOS = [
  { id: "gratuito", rotulo: "Gratuito" },
  { id: "dominio_publico", rotulo: "Domínio público" },
  { id: "comercial", rotulo: "Comercial" },
] as const;

function acharNome(nos: NoArvore[], slug: string): string | null {
  for (const no of nos) {
    if (no.slug === slug) return no.nome;
    const filho = acharNome(no.filhos, slug);
    if (filho) return filho;
  }
  return null;
}

export default async function PaginaBiblioteca({
  searchParams,
}: {
  searchParams: Promise<{ assunto?: string; acesso?: string }>;
}) {
  const { assunto, acesso } = await searchParams;
  const [livros, mapa] = await Promise.all([
    listarLivros({ assunto, acesso }),
    arvoreConhecimento(),
  ]);
  const nomeAssunto = assunto ? acharNome(mapa, assunto) : null;
  const areas = mapa.filter((no) => no.tipo === "area" || no.tipo === "objetivo");

  return (
    <div className="pagina">
      <p className="olho">Estante aberta</p>
      <h1>Biblioteca</h1>
      <p className="subtitulo">
        Links para materiais que podem ser usados no estudo. O arquivo gratuito abre na fonte oficial. Livro comercial
        não tem PDF aqui.
      </p>

      <nav className="linha" aria-label="Filtrar por tipo de acesso">
        <Link className={!acesso ? "btn btn-primary" : "btn btn-ghost"} href={assunto ? `/biblioteca?assunto=${assunto}` : "/biblioteca"}>
          Todos
        </Link>
        {ACESSOS.map((item) => (
          <Link
            key={item.id}
            className={acesso === item.id ? "btn btn-primary" : "btn btn-ghost"}
            href={assunto ? `/biblioteca?assunto=${assunto}&acesso=${item.id}` : `/biblioteca?acesso=${item.id}`}
          >
            {item.rotulo}
          </Link>
        ))}
      </nav>

      <nav className="linha" aria-label="Filtrar por área">
        <Link className={!assunto ? "btn btn-primary" : "btn btn-ghost"} href={acesso ? `/biblioteca?acesso=${acesso}` : "/biblioteca"}>
          Todas as áreas
        </Link>
        {areas.map((area) => (
          <Link
            key={area.slug}
            className={assunto === area.slug ? "btn btn-primary" : "btn btn-ghost"}
            href={acesso ? `/biblioteca?assunto=${area.slug}&acesso=${acesso}` : `/biblioteca?assunto=${area.slug}`}
          >
            {area.nome}
          </Link>
        ))}
      </nav>

      {assunto && !nomeAssunto ? <AvisoErro erro="Esse assunto não está no mapa." /> : null}
      {nomeAssunto ? <p className="muted">Mostrando {nomeAssunto} e o que está dentro deste assunto.</p> : null}

      {livros.length === 0 ? (
        <p className="muted">Nenhum material com esse filtro. A estante só guarda o que tem fonte identificada.</p>
      ) : (
        <ul className="lista">
          {livros.map((livro) => (
            <li key={livro.slug} className="cartao pilha">
              <p className={`selo selo-${livro.tipoAcesso === "comercial" ? "incorreta" : "correta"}`}>
                <strong>{ROTULO_ACESSO[livro.tipoAcesso] ?? livro.tipoAcesso}</strong>
              </p>
              <h2>
                <Link href={`/biblioteca/${livro.slug}`}>{livro.titulo}</Link>
              </h2>
              <p>{livro.autores}</p>
              <p className="meta">
                {livro.nivel}
                {livro.assunto ? ` · ${livro.assunto}` : ""}
              </p>
              <p>{livro.descricao}</p>
              <a href={livro.ondeObter} target="_blank" rel="noreferrer noopener">
                {livro.tipoAcesso === "comercial" ? "Ver onde encontrar legalmente" : "Abrir o material gratuito"}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
