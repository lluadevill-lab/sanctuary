import EmbeddedSite from "@/components/EmbeddedSite";

export const metadata = { title: "Biblioteca | Sanctuary Codex" };

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="rune-socket h-8 w-8 bg-gold shadow-gold" />
        <div>
          <p className="text-xs uppercase tracking-widest text-parchment/40">
            Referência
          </p>
          <h1 className="font-display text-2xl text-gold-bright sm:text-3xl">
            Biblioteca
          </h1>
        </div>
      </div>
      <EmbeddedSite
        src="https://diablo2.com.br/library/"
        title="Biblioteca do Diablo II Evolution"
      />
    </div>
  );
}
