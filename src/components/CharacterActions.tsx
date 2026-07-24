"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { addCharacterRelation, removeCharacterRelation } from "@/lib/actions";

export default function CharacterActions({
  characterName,
  isLoggedIn,
  mineId,
  favoriteId,
}: {
  characterName: string;
  isLoggedIn: boolean;
  mineId: string | null;
  favoriteId: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [mine, setMine] = useState(mineId);
  const [favorite, setFavorite] = useState(favoriteId);

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="rounded-md border border-gold/40 px-3 py-1.5 text-xs font-medium text-gold-bright hover:bg-gold/10"
      >
        Entrar para salvar
      </Link>
    );
  }

  function toggleMine() {
    startTransition(async () => {
      if (mine) {
        await removeCharacterRelation(mine);
        setMine(null);
      } else {
        await addCharacterRelation(characterName, "mine");
        setMine("pending");
      }
    });
  }

  function toggleFavorite() {
    startTransition(async () => {
      if (favorite) {
        await removeCharacterRelation(favorite);
        setFavorite(null);
      } else {
        await addCharacterRelation(characterName, "favorite");
        setFavorite("pending");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMine}
        disabled={pending}
        aria-pressed={!!mine}
        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
          mine
            ? "border-gold bg-gold/15 text-gold-bright"
            : "border-void-line text-parchment/70 hover:border-gold/50"
        }`}
      >
        {mine ? "★ Meu personagem" : "+ Marcar como meu"}
      </button>
      <button
        onClick={toggleFavorite}
        disabled={pending}
        aria-pressed={!!favorite}
        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
          favorite
            ? "border-blood-bright bg-blood/20 text-blood-bright"
            : "border-void-line text-parchment/70 hover:border-blood-bright/60"
        }`}
      >
        {favorite ? "♥ Favoritado" : "♡ Favoritar"}
      </button>
    </div>
  );
}
