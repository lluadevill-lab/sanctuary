"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSignOut() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={pending}
      className="rounded-md border border-void-line px-3 py-1.5 text-xs font-medium text-parchment/60 hover:border-blood-bright hover:text-blood-bright disabled:opacity-60"
    >
      {pending ? "Saindo..." : "Sair da conta"}
    </button>
  );
}
