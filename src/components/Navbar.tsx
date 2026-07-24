import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavClient from "./NavClient";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/runewords", label: "Runewords" },
  { href: "/breakpoints", label: "Breakpoints" },
  { href: "/maps", label: "Mapas" },
  { href: "/library", label: "Biblioteca" },
];

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { username: string; avatar_url: string | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-void-line/70 bg-void/95 backdrop-blur supports-[backdrop-filter]:bg-void/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 shrink-0">
          <span className="rune-socket h-6 w-6 bg-rune shadow-rune transition-transform group-hover:rotate-45" />
          <span className="font-display text-lg tracking-wide text-gold-bright text-glow-gold sm:text-xl">
            SANCTUARY CODEX
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded px-3 py-2 text-sm font-medium text-parchment/70 transition-colors hover:bg-void-raised hover:text-gold-bright"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <NavClient
          links={LINKS}
          isLoggedIn={!!user}
          username={profile?.username ?? null}
          avatarUrl={profile?.avatar_url ?? null}
        />
      </div>
      <div className="divider-rune" />
    </header>
  );
}
