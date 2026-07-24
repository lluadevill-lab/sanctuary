export type Rune = {
  order: number;
  name: string;
  level: number;
  weapon: string;
  armorHelm: string;
  shield: string;
};

export type Runeword = {
  slug: string;
  name: string;
  patch: string;
  runes: string[];
  level: number;
  itemTypes: string[];
  sockets: number;
  class: string | null;
  attributes: string[];
};

export type CharacterRelation = "mine" | "favorite";

export type CharacterEntry = {
  id: string;
  profile_id: string;
  character_name: string;
  relation: CharacterRelation;
  note: string | null;
  created_at: string;
};

export type SearchHistoryEntry = {
  id: string;
  profile_id: string;
  character_name: string;
  searched_at: string;
};

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
};

export type Achievement = {
  code: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  metric: "searches" | "mine" | "favorites" | "runewords_viewed";
};

export type UserAchievement = {
  profile_id: string;
  achievement_code: string;
  unlocked_at: string;
};
