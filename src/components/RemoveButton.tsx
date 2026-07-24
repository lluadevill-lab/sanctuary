"use client";

import { useTransition } from "react";
import { removeCharacterRelation } from "@/lib/actions";

export default function RemoveButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => removeCharacterRelation(id))}
      disabled={pending}
      aria-label="Remover"
      className="rounded px-2 py-1 text-xs text-parchment/40 hover:text-blood-bright disabled:opacity-50"
    >
      ✕
    </button>
  );
}
