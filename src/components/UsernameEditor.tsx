"use client";

import { useState, useTransition } from "react";
import { updateUsername } from "@/lib/actions";

export default function UsernameEditor({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await updateUsername(value.trim());
        setEditing(false);
      } catch (e) {
        setError("Esse nome já está em uso.");
      }
    });
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group flex items-center gap-2 font-display text-2xl text-gold-bright"
      >
        {initial}
        <span className="text-xs font-body text-parchment/30 group-hover:text-gold/60">
          editar
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="rounded-md border border-void-line bg-void px-2 py-1 text-lg text-parchment focus:border-gold/60 focus:outline-none"
          autoFocus
        />
        <button
          onClick={save}
          disabled={pending}
          className="rounded-md bg-gold px-3 py-1 text-sm font-semibold text-void hover:bg-gold-bright"
        >
          Salvar
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setValue(initial);
          }}
          className="text-sm text-parchment/50 hover:text-parchment"
        >
          Cancelar
        </button>
      </div>
      {error && <p className="text-xs text-blood-bright">{error}</p>}
    </div>
  );
}
