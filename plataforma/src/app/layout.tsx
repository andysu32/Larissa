import type { Metadata } from "next";
import { Newsreader, Outfit } from "next/font/google";
import { Shell } from "@/components/Shell";
import { getUsuarioAtual } from "@/lib/session";
import "./globals.css";

const texto = Outfit({ subsets: ["latin"], variable: "--fonte-texto", weight: ["400", "500", "600"] });
const titulo = Newsreader({ subsets: ["latin"], variable: "--fonte-titulo", weight: ["500", "600"] });

export const metadata: Metadata = {
  title: "Aprenda",
  description: "Plataforma educacional gratuita para aprender, ensinar e compartilhar.",
};

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const usuario = await getUsuarioAtual();
  const fonte = usuario?.tamanhoFonte ?? "md";
  return (
    <html lang="pt-BR" className={`${texto.variable} ${titulo.variable} fonte-${fonte}`}>
      <body>
        <Shell usuario={usuario}>{children}</Shell>
      </body>
    </html>
  );
}
