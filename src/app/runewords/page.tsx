import { createClient } from "@/lib/supabase/server";
import RunewordsExplorer from "@/components/RunewordsExplorer";
import runewordsData from "@/data/runewords.json";
import runesData from "@/data/runes.json";
import type { Runeword, Rune } from "@/types";

export const metadata = { title: "Runewords | Sanctuary Codex" };

export default async function RunewordsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="rune-socket h-8 w-8 bg-gold shadow-gold" />
        <div>
          <p className="text-xs uppercase tracking-widest text-parchment/40">
            Forja
          </p>
          <h1 className="font-display text-2xl text-gold-bright sm:text-3xl">
            Runewords
          </h1>
        </div>
      </div>
      <RunewordsExplorer
        runewords={runewordsData as Runeword[]}
        runes={runesData as Rune[]}
        isLoggedIn={!!user}
      />
    </div>
  );
}
