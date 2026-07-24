import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SearchBar from "@/components/SearchBar";
import CharacterChip from "@/components/CharacterChip";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let mine: { character_name: string }[] = [];
  let favorites: { character_name: string }[] = [];
  let recent: { character_name: string; searched_at: string }[] = [];

  if (user) {
    const [mineRes, favRes, historyRes] = await Promise.all([
      supabase
        .from("characters")
        .select("character_name")
        .eq("profile_id", user.id)
        .eq("relation", "mine")
        .order("created_at", { ascending: false }),
      supabase
        .from("characters")
        .select("character_name")
        .eq("profile_id", user.id)
        .eq("relation", "favorite")
        .order("created_at", { ascending: false }),
      supabase
        .from("search_history")
        .select("character_name, searched_at")
        .eq("profile_id", user.id)
        .order("searched_at", { ascending: false })
        .limit(8),
    ]);
    mine = mineRes.data ?? [];
    favorites = favRes.data ?? [];
    recent = historyRes.data ?? [];
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-void-line/60 bg-stone-gradient px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="mb-4 rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold/80">
            Companion não-oficial · Diablo II Evolution
          </span>
          <h1 className="font-display text-4xl leading-tight text-parchment text-glow-gold sm:text-6xl">
            Encaixe a runa certa.
            <br />
            <span className="text-gold-bright">Encontre seu herói.</span>
          </h1>
          <p className="mt-5 max-w-xl text-parchment/60">
            Busque qualquer personagem do servidor, monte runewords, consulte
            mapas e a biblioteca — tudo em um só lugar, com o clima sombrio de
            Sanctuary.
          </p>
          <div className="mt-8 w-full flex justify-center">
            <SearchBar isLoggedIn={!!user} size="lg" />
          </div>
          <p className="mt-3 text-xs text-parchment/40">
            Dica: o nome deve ser exatamente igual ao do personagem no jogo.
          </p>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <QuickLinkCard
          href="/runewords"
          title="Runewords"
          desc="98 receitas de 1.09 a 2.6, calculadora por runas que você tem."
          glyph="◈"
        />
        <QuickLinkCard
          href="/maps"
          title="Mapas"
          desc="Áreas do jogo, direto do diablo2.com.br."
          glyph="🗺"
        />
        <QuickLinkCard
          href="/library"
          title="Biblioteca"
          desc="Conteúdo e guias do servidor Diablo II Evolution."
          glyph="📖"
        />
      </section>

      {/* USER AREA */}
      {user ? (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <PanelList
              title="Meus Personagens"
              emptyText="Você ainda não marcou nenhum personagem como seu."
              href="/profile"
              items={mine.map((m) => m.character_name)}
            />
            <PanelList
              title="Favoritos"
              emptyText="Nenhum personagem favoritado ainda."
              href="/profile"
              items={favorites.map((f) => f.character_name)}
            />
            <div className="rounded-lg border border-void-line bg-void-panel/60 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg text-gold-bright">
                  Buscas Recentes
                </h3>
                <Link href="/profile" className="text-xs text-parchment/50 hover:text-gold">
                  ver perfil
                </Link>
              </div>
              {recent.length === 0 ? (
                <p className="text-sm text-parchment/40">
                  Seu histórico de busca vai aparecer aqui.
                </p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {recent.map((r, idx) => (
                    <li key={idx}>
                      <CharacterChip name={r.character_name} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-3xl px-4 pb-16 text-center sm:px-6">
          <div className="rounded-lg border border-void-line bg-void-panel/60 p-8">
            <h3 className="font-display text-xl text-gold-bright">
              Crie sua conta no Codex
            </h3>
            <p className="mt-2 text-sm text-parchment/60">
              Salve personagens favoritos, marque os seus, acompanhe seu
              histórico de busca e desbloqueie conquistas.
            </p>
            <Link
              href="/signup"
              className="mt-5 inline-block rounded-md bg-gold px-5 py-2.5 font-display font-semibold text-void hover:bg-gold-bright"
            >
              Criar conta grátis
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function QuickLinkCard({
  href,
  title,
  desc,
  glyph,
}: {
  href: string;
  title: string;
  desc: string;
  glyph: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-void-line bg-void-panel/60 p-6 transition-colors hover:border-gold/50 hover:bg-void-raised"
    >
      <div className="mb-3 text-3xl">{glyph}</div>
      <h3 className="font-display text-lg text-gold-bright group-hover:text-gold-bright">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-parchment/55">{desc}</p>
    </Link>
  );
}

function PanelList({
  title,
  items,
  emptyText,
  href,
}: {
  title: string;
  items: string[];
  emptyText: string;
  href: string;
}) {
  return (
    <div className="rounded-lg border border-void-line bg-void-panel/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg text-gold-bright">{title}</h3>
        <Link href={href} className="text-xs text-parchment/50 hover:text-gold">
          ver tudo
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-parchment/40">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.slice(0, 6).map((name) => (
            <li key={name}>
              <CharacterChip name={name} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
