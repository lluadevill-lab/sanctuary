import type { Metadata } from "next";
import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Sanctuary Codex | Diablo II Evolution Companion",
  description:
    "Companion não-oficial para o servidor Diablo II Evolution: personagens, runewords, mapas e biblioteca.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body min-h-screen">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <footer className="border-t border-void-line/60 py-6 text-center text-xs text-parchment/40 font-body">
            Sanctuary Codex — companion não-oficial para Diablo II: Lord of Destruction.
            Não afiliado à Blizzard Entertainment ou ao servidor Diablo II Evolution.
          </footer>
        </div>
      </body>
    </html>
  );
}
