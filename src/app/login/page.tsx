"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message
      );
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="rounded-lg border border-void-line bg-void-panel/70 p-8">
        <div className="mb-6 text-center">
          <span className="rune-socket mx-auto mb-3 block h-10 w-10 bg-gold shadow-gold" />
          <h1 className="font-display text-2xl text-gold-bright">Entrar</h1>
          <p className="mt-1 text-sm text-parchment/50">
            Acesse sua conta no Sanctuary Codex.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="E-mail">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-void-line bg-void px-3 py-2 text-sm text-parchment focus:border-gold/60 focus:outline-none"
            />
          </Field>
          <Field label="Senha">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-void-line bg-void px-3 py-2 text-sm text-parchment focus:border-gold/60 focus:outline-none"
            />
          </Field>

          {error && <p className="text-sm text-blood-bright">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-gold py-2.5 font-display font-semibold text-void hover:bg-gold-bright disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-parchment/50">
          Não tem conta?{" "}
          <Link href="/signup" className="text-gold-bright hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wide text-parchment/50">{label}</span>
      {children}
    </label>
  );
}
