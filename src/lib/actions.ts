"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Achievement } from "@/types";

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not_authenticated");
  return { supabase, user };
}

export async function checkAchievements() {
  const { supabase, user } = await requireUser();

  const { data: stats } = await supabase
    .from("profile_stats")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*");

  const { data: unlocked } = await supabase
    .from("user_achievements")
    .select("achievement_code")
    .eq("profile_id", user.id);

  const unlockedCodes = new Set((unlocked ?? []).map((u) => u.achievement_code));
  const metricMap: Record<Achievement["metric"], number> = {
    searches: stats?.searches_count ?? 0,
    mine: stats?.mine_count ?? 0,
    favorites: stats?.favorites_count ?? 0,
    runewords_viewed: stats?.runewords_viewed_count ?? 0,
  };

  const toUnlock = (achievements ?? []).filter(
    (a: Achievement) =>
      !unlockedCodes.has(a.code) && metricMap[a.metric] >= a.threshold
  );

  if (toUnlock.length > 0) {
    await supabase.from("user_achievements").insert(
      toUnlock.map((a: Achievement) => ({
        profile_id: user.id,
        achievement_code: a.code,
      }))
    );
  }

  return toUnlock;
}

export async function logSearch(characterName: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("search_history").insert({
    profile_id: user.id,
    character_name: characterName,
  });
  await checkAchievements();
  revalidatePath("/profile");
}

export async function logRunewordView(slug: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("runeword_views")
    .upsert({ profile_id: user.id, runeword_slug: slug }, { onConflict: "profile_id,runeword_slug" });
  await checkAchievements();
}

export async function addCharacterRelation(
  characterName: string,
  relation: "mine" | "favorite"
) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("characters").upsert(
    {
      profile_id: user.id,
      character_name: characterName,
      relation,
    },
    { onConflict: "profile_id,character_name,relation" }
  );
  if (error) throw error;
  await checkAchievements();
  revalidatePath("/profile");
  revalidatePath(`/char/${characterName}`);
}

export async function removeCharacterRelation(id: string) {
  const { supabase } = await requireUser();
  await supabase.from("characters").delete().eq("id", id);
  revalidatePath("/profile");
}

export async function updateAvatar(avatarUrl: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
  revalidatePath("/profile");
}

export async function updateUsername(username: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id);
  if (error) throw error;
  revalidatePath("/profile");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}
