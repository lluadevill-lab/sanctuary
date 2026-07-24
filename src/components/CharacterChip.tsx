import Link from "next/link";

export default function CharacterChip({ name }: { name: string }) {
  return (
    <Link
      href={`/char/${encodeURIComponent(name)}`}
      className="flex items-center gap-2 rounded-md border border-void-line/70 bg-void/60 px-3 py-2 text-sm text-parchment/80 transition-colors hover:border-gold/50 hover:text-gold-bright"
    >
      <span className="rune-socket h-2.5 w-2.5 bg-rune" />
      {name}
    </Link>
  );
}
