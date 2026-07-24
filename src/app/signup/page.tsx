"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import avatars from "@/data/avatars.generated.json";

export default function SignupPage() {
  const list = avatars as string[];
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string>(list[0] ?? "");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, avatar_url: avatar },
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setNotice("Conta criada! Verifique seu e-mail para confirmar o acesso.");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16 sm:px-6">
      <div className="rounded-lg border border-void-line bg-void-panel/70 p-8">
        <div className="mb-6 text-center">
          <span className="rune-socket mx-auto mb-3 block h-10 w-10 bg-gold shadow-gold" />
          <h1 className="font-display text-2xl text-gold-bright">Criar conta</h1>
          <p className="mt-1 text-sm text-parchment/50">
            Salve personagens, favoritos e desbloqueie conquistas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Nome de usuário">
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-void-line bg-void px-3 py-2 text-sm text-parchment focus:border-gold/60 focus:outline-none"
            />
          </Field>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-void-line bg-void px-3 py-2 text-sm text-parchment focus:border-gold/60 focus:outline-none"
            />
          </Field>

          {list.length > 0 && (
            <div>
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-parchment/50">
                Escolha uma foto de perfil
              </span>
              <div className="grid grid-cols-6 gap-2">
                {list.map((src) => (
                  <button
                    type="button"
                    key={src}
                    onClick={() => setAvatar(src)}
                    className={`relative aspect-square overflow-hidden rounded-full border-2 ${
                      avatar === src ? "border-gold-bright shadow-gold" : "border-void-line"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="60px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-blood-bright">{error}</p>}
          {notice && <p className="text-sm text-rune-glow">{notice}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-gold py-2.5 font-display font-semibold text-void hover:bg-gold-bright disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-parchment/50">
          Já tem conta?{" "}
          <Link href="/login" className="text-gold-bright hover:underline">
            Entrar
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
