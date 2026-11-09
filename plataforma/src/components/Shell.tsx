import Link from "next/link";
import { sair } from "@/lib/acoes-sessao";
import type { UsuarioAtual } from "@/lib/tipos";
import { nomeVisivel } from "@/lib/texto";
import { ehModerador } from "@/lib/regras";

export function Shell({
  usuario,
  children,
}: {
  usuario: UsuarioAtual | null;
  children: React.ReactNode;
}) {
  const moderador = usuario ? ehModerador(usuario.papeis) : false;
  return (
    <>
      <a className="pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <header className="topbar">
        <Link className="marca" href="/">
          Aprenda
        </Link>
        <nav aria-label="Principal">
          <Link href="/perguntas">Perguntas</Link>
          <Link href="/revisao">Revisão</Link>
          <Link href="/mapa">Mapa</Link>
          <Link href="/comunidades">Comunidades</Link>
          <Link href="/biblioteca">Biblioteca</Link>
          <Link href="/busca">Busca</Link>
          <Link href="/progresso">Progresso</Link>
          {moderador ? <Link href="/moderacao">Moderação</Link> : null}
        </nav>
        <div className="conta">
          {usuario ? (
            <>
              <Link href="/perfil">{nomeVisivel(usuario)}</Link>
              <form action={sair}>
                <button className="btn btn-ghost" type="submit">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/entrar">Entrar</Link>
              <Link className="btn btn-primary" href="/cadastro">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </header>
      {usuario?.bloqueado ? (
        <p className="aviso aviso-faixa" role="status">
          Esta conta está bloqueada para publicar. Você ainda pode ler e registrar uma apelação no perfil.
        </p>
      ) : null}
      <main id="conteudo">{children}</main>
      <footer className="rodape">
        <p>Aprenda. Ensine. Compartilhe. Evolua.</p>
        <p>Uma resposta não fica correta porque recebeu muitos votos.</p>
      </footer>
    </>
  );
}
