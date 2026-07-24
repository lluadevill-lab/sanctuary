import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AvatarPicker from "@/components/AvatarPicker";
import UsernameEditor from "@/components/UsernameEditor";
import RemoveButton from "@/components/RemoveButton";
import CharacterChip from "@/components/CharacterChip";
import AchievementBadge from "@/components/AchievementBadge";
import SignOutButton from "@/components/SignOutButton";
import type { Achievement } from "@/types";

export const metadata = { title: "Meu Perfil | Sanctuary Codex" };

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [
    profileRes,
    mineRes,
    favRes,
    historyRes,
    achievementsRes,
    unlockedRes,
  ] = await Promise.all([
    supabase.from("profiles").select("username, avatar_url").eq("id", user.id).single(),
    supabase
      .from("characters")
      .select("id, character_name, created_at")
      .eq("profile_id", user.id)
      .eq("relation", "mine")
      .order("created_at", { ascending: false }),
    supabase
      .from("characters")
      .select("id, character_name, created_at")
      .eq("profile_id", user.id)
      .eq("relation", "favorite")
      .order("created_at", { ascending: false }),
    supabase
      .from("search_history")
      .select("id, character_name, searched_at")
      .eq("profile_id", user.id)
      .order("searched_at", { ascending: false })
      .limit(20),
    supabase.from("achievements").select("*").order("threshold", { ascending: true }),
    supabase.from("user_achievements").select("achievement_code").eq("profile_id", user.id),
  ]);

  const profile = profileRes.data;
  const mine = mineRes.data ?? [];
  const favorites = favRes.data ?? [];
  const history = historyRes.data ?? [];
  const achievements = (achievementsRes.data ?? []) as Achievement[];
  const unlockedCodes = new Set((unlockedRes.data ?? []).map((u) => u.achievement_code));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* HEADER */}
      <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gold/50 bg-void-panel">
            {profile?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div>
            <UsernameEditor initial={profile?.username ?? "Aventureiro"} />
            <p className="mt-1 text-sm text-parchment/40">{user.email}</p>
          </div>
        </div>
        <SignOutButton />
      </div>

      <Section title="Foto de Perfil">
        <AvatarPicker currentAvatar={profile?.avatar_url ?? null} />
      </Section>

      <Section title={`Meus Personagens (${mine.length})`}>
        {mine.length === 0 ? (
          <EmptyState text="Marque personagens como seus na página do Armory deles." />
        ) : (
          <ListGrid>
            {mine.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-md border border-void-line/70 bg-void/60 px-3 py-2"
              >
                <CharacterChip name={c.character_name} />
                <RemoveButton id={c.id} />
              </li>
            ))}
          </ListGrid>
        )}
      </Section>

      <Section title={`Favoritos (${favorites.length})`}>
        {favorites.length === 0 ? (
          <EmptyState text="Favorite personagens de outros jogadores para acompanhá-los aqui." />
        ) : (
          <ListGrid>
            {favorites.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-md border border-void-line/70 bg-void/60 px-3 py-2"
              >
                <CharacterChip name={c.character_name} />
                <RemoveButton id={c.id} />
              </li>
            ))}
          </ListGrid>
        )}
      </Section>

      <Section title="Histórico de Busca">
        {history.length === 0 ? (
          <EmptyState text="Suas buscas por personagens vão aparecer aqui." />
        ) : (
          <ul className="flex flex-col gap-1.5">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between rounded-md border border-void-line/50 bg-void/40 px-3 py-1.5 text-sm"
              >
                <CharacterChip name={h.character_name} />
                <span className="text-xs text-parchment/35">
                  {new Date(h.searched_at).toLocaleString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Conquistas (${unlockedCodes.size}/${achievements.length})`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {achievements.map((a) => (
            <AchievementBadge
              key={a.code}
              achievement={a}
              unlocked={unlockedCodes.has(a.code)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-display text-lg text-gold-bright">{title}</h2>
      <div className="divider-rune mb-4" />
      {children}
    </section>
  );
}

function ListGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-parchment/40">{text}</p>;
}
