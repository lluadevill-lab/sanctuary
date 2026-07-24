"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NavClient({
  links,
  isLoggedIn,
  username,
  avatarUrl,
}: {
  links: { href: string; label: string }[];
  isLoggedIn: boolean;
  username: string | null;
  avatarUrl: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:block">
        {isLoggedIn ? (
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-full border border-void-line bg-void-raised px-2 py-1 pr-3 transition-colors hover:border-gold/60"
          >
            <span className="relative h-7 w-7 overflow-hidden rounded-full border border-gold/50 bg-void">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="" fill sizes="28px" className="object-cover" />
              ) : null}
            </span>
            <span className="text-sm text-parchment/80">{username ?? "Perfil"}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded border border-gold/50 px-3 py-1.5 text-sm font-medium text-gold-bright transition-colors hover:bg-gold/10"
          >
            Entrar
          </Link>
        )}
      </div>

      <button
        aria-label="Abrir menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded border border-void-line md:hidden"
      >
        <span className="sr-only">Menu</span>
        <div className="flex flex-col gap-1">
          <span className="block h-0.5 w-5 bg-gold-bright" />
          <span className="block h-0.5 w-5 bg-gold-bright" />
          <span className="block h-0.5 w-5 bg-gold-bright" />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-void-line bg-void px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2 text-sm text-parchment/80 hover:bg-void-raised hover:text-gold-bright"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={isLoggedIn ? "/profile" : "/login"}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2 text-sm text-gold-bright hover:bg-void-raised"
            >
              {isLoggedIn ? username ?? "Perfil" : "Entrar"}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
