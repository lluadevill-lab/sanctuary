import { createClient } from "@/lib/supabase/server";
import EmbeddedSite from "@/components/EmbeddedSite";
import CharacterActions from "@/components/CharacterActions";

export default async function CharacterPage({
  params,
}: {
  params: { name: string };
}) {
  const name = decodeURIComponent(params.name);
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let mineId: string | null = null;
  let favoriteId: string | null = null;

  if (user) {
    const { data } = await supabase
      .from("characters")
      .select("id, relation")
      .eq("profile_id", user.id)
      .eq("character_name", name);
    mineId = data?.find((d) => d.relation === "mine")?.id ?? null;
    favoriteId = data?.find((d) => d.relation === "favorite")?.id ?? null;
  }

  const src = `https://diablo2.com.br/char/${encodeURIComponent(name)}/`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rune-socket h-8 w-8 bg-gold shadow-gold" />
          <div>
            <p className="text-xs uppercase tracking-widest text-parchment/40">
              Armory
            </p>
            <h1 className="font-display text-2xl text-gold-bright sm:text-3xl">
              {name}
            </h1>
          </div>
        </div>
        <CharacterActions
          characterName={name}
          isLoggedIn={!!user}
          mineId={mineId}
          favoriteId={favoriteId}
        />
      </div>

      <EmbeddedSite src={src} title={`Armory de ${name}`} />

      <p className="mt-3 text-xs text-parchment/35">
        Conteúdo carregado diretamente de{" "}
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gold"
        >
          diablo2.com.br
        </a>
        . Sanctuary Codex não armazena nem altera dados de personagens do
        servidor.
      </p>
    </div>
  );
}
