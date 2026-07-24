"use client";

import { useEffect } from "react";
import type { Runeword } from "@/types";
import RuneIcon from "./RuneIcon";

export default function RunewordDetailModal({
  runeword,
  runeImageMap,
  onClose,
}: {
  runeword: Runeword;
  runeImageMap: Record<string, string>;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={runeword.name}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-xl border border-gold/40 bg-void-panel p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 rounded-full border border-void-line px-2 py-1 text-xs text-parchment/60 hover:border-gold/60 hover:text-gold-bright"
        >
          ✕
        </button>

        <div className="mb-4 flex justify-center gap-2">
          {runeword.runes.map((r, i) => (
            <RuneIcon key={i} name={r} image={runeImageMap[r] ?? ""} size={44} glowing />
          ))}
        </div>

        <h2 className="text-center font-display text-2xl text-gold-bright text-glow-gold">
          {runeword.name}
        </h2>
        <p className="mt-1 text-center font-mono text-xs uppercase tracking-widest text-parchment/40">
          {runeword.runes.join(" + ")}
        </p>

        <div className="divider-rune my-4" />

        <ul className="flex flex-col gap-1.5 text-center">
          {runeword.attributes.map((a, i) => (
            <li key={i} className="text-sm text-parchment/80">
              {a}
            </li>
          ))}
        </ul>

        <div className="divider-rune my-4" />

        <div className="grid grid-cols-2 gap-y-1.5 text-center text-xs text-parchment/60">
          <div>
            <span className="block text-parchment/40">Sockets</span>
            {runeword.sockets}
          </div>
          <div>
            <span className="block text-parchment/40">Nível requerido</span>
            {runeword.level}
          </div>
          <div>
            <span className="block text-parchment/40">Tipo de item</span>
            {runeword.itemTypes.join(", ")}
          </div>
          <div>
            <span className="block text-parchment/40">Patch</span>
            {runeword.patch}
          </div>
          {runeword.class && (
            <div className="col-span-2">
              <span className="block text-parchment/40">Classe</span>
              {runeword.class}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
