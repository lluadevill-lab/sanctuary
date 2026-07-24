"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateAvatar } from "@/lib/actions";
import avatars from "@/data/avatars.generated.json";

export default function AvatarPicker({
  currentAvatar,
}: {
  currentAvatar: string | null;
}) {
  const [selected, setSelected] = useState(currentAvatar);
  const [pending, startTransition] = useTransition();
  const list = avatars as string[];

  function choose(src: string) {
    setSelected(src);
    startTransition(() => {
      updateAvatar(src).catch(() => {});
    });
  }

  if (list.length === 0) {
    return (
      <p className="text-sm text-parchment/50">
        Nenhum avatar disponível ainda. Coloque imagens em{" "}
        <code className="rounded bg-void px-1 py-0.5">public/avatars/</code> e rode
        o build novamente.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
      {list.map((src) => (
        <button
          key={src}
          onClick={() => choose(src)}
          disabled={pending}
          aria-pressed={selected === src}
          className={`relative aspect-square overflow-hidden rounded-full border-2 transition-all ${
            selected === src
              ? "border-gold-bright shadow-gold"
              : "border-void-line hover:border-gold/50"
          }`}
        >
          <Image src={src} alt="" fill sizes="80px" className="object-cover" />
        </button>
      ))}
    </div>
  );
}
