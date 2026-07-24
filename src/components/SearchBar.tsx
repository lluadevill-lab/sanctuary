"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logSearch } from "@/lib/actions";

export default function SearchBar({
  isLoggedIn,
  size = "lg",
}: {
  isLoggedIn: boolean;
  size?: "lg" | "sm";
}) {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = value.trim();
    if (!name) return;
    if (isLoggedIn) {
      startTransition(() => {
        logSearch(name).catch(() => {});
      });
    }
    router.push(`/char/${encodeURIComponent(name)}`);
  }

  const isLarge = size === "lg";

  return (
    <form
      onSubmit={handleSubmit}
      className={`group relative flex w-full items-center gap-2 rounded-lg border border-void-line bg-void-panel/80 p-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.4)] transition-colors focus-within:border-gold/60 ${
        isLarge ? "max-w-2xl" : "max-w-md"
      }`}
    >
      <span
        className={`rune-socket ml-2 shrink-0 bg-void group-focus-within:bg-socket-glow ${
          isLarge ? "h-8 w-8" : "h-6 w-6"
        } border border-void-line`}
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar personagem por nome exato... ex: Murdoc"
        className={`flex-1 bg-transparent font-body text-parchment placeholder:text-parchment/35 focus:outline-none ${
          isLarge ? "py-3 text-base sm:text-lg" : "py-2 text-sm"
        }`}
        aria-label="Nome do personagem"
      />
      <button
        type="submit"
        disabled={isPending}
        className={`shrink-0 rounded-md bg-gold px-4 font-display font-semibold tracking-wide text-void transition-colors hover:bg-gold-bright disabled:opacity-60 ${
          isLarge ? "py-3 text-sm sm:text-base" : "py-2 text-xs"
        }`}
      >
        Invocar
      </button>
    </form>
  );
}
