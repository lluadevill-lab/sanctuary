"use client";

import { useMemo, useState } from "react";
import type { Runeword, Rune, CubeUnionRecipe, CubeSplitRecipe } from "@/types";
import RunewordDetailModal from "./RunewordDetailModal";
import RuneIcon from "./RuneIcon";
import { logRunewordView } from "@/lib/actions";

type Category = "Todos" | "Armas" | "Armaduras" | "Elmos" | "Escudos";

function categorize(itemTypes: string[]): Category {
  const s = itemTypes.join(" ").toLowerCase();
  if (s.includes("helm")) return "Elmos";
  if (s.includes("shield") || s.includes("grimoire") || s.includes("voodoo") || s.includes("auric"))
    return "Escudos";
  if (s.includes("armor")) return "Armaduras";
  return "Armas";
}

const CATEGORIES: Category[] = ["Todos", "Armas", "Armaduras", "Elmos", "Escudos"];

export default function RunewordsExplorer({
  runewords,
  runes,
  cubeData,
  isLoggedIn,
}: {
  runewords: Runeword[];
  runes: Rune[];
  cubeData: { union: CubeUnionRecipe[]; splitHigh: CubeSplitRecipe[] };
  isLoggedIn: boolean;
}) {
  const [tab, setTab] = useState<"browse" | "calc" | "table" | "cube">("browse");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("Todos");
  const [patch, setPatch] = useState<string>("Todos");
  const [selected, setSelected] = useState<Runeword | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const runeImageMap = useMemo(() => {
    const map: Record<string, string> = {};
    runes.forEach((r) => (map[r.name] = r.image));
    return map;
  }, [runes]);

  const patches = useMemo(
    () => ["Todos", ...Array.from(new Set(runewords.map((r) => r.patch)))],
    [runewords]
  );

  const filtered = useMemo(() => {
    return runewords.filter((r) => {
      if (category !== "Todos" && categorize(r.itemTypes) !== category) return false;
      if (patch !== "Todos" && r.patch !== patch) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matches =
          r.name.toLowerCase().includes(q) ||
          r.runes.join(" ").toLowerCase().includes(q) ||
          r.itemTypes.join(" ").toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [runewords, category, patch, search]);

  const forgeable = useMemo(() => {
    const have = Object.entries(counts).filter(([, n]) => n > 0);
    if (have.length === 0) return [];
    return runewords.filter((rw) => {
      const need: Record<string, number> = {};
      rw.runes.forEach((r) => (need[r] = (need[r] ?? 0) + 1));
      return Object.entries(need).every(([rune, n]) => (counts[rune] ?? 0) >= n);
    });
  }, [runewords, counts]);

  function openDetail(rw: Runeword) {
    setSelected(rw);
    if (isLoggedIn) logRunewordView(rw.slug).catch(() => {});
  }

  function cycleCount(rune: string) {
    setCounts((c) => {
      const cur = c[rune] ?? 0;
      const next = cur >= 6 ? 0 : cur + 1;
      return { ...c, [rune]: next };
    });
  }

  return (
    <div>
      {/* TABS */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-void-line pb-3">
        <TabButton active={tab === "browse"} onClick={() => setTab("browse")}>
          Buscar Runewords
        </TabButton>
        <TabButton active={tab === "calc"} onClick={() => setTab("calc")}>
          Calculadora de Runas
        </TabButton>
        <TabButton active={tab === "table"} onClick={() => setTab("table")}>
          Tabela de Runas
        </TabButton>
        <TabButton active={tab === "cube"} onClick={() => setTab("cube")}>
          Cubo Horadrico
        </TabButton>
      </div>

      {tab === "browse" && (
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, runa ou tipo de item..."
              className="w-full flex-1 rounded-md border border-void-line bg-void-panel px-3 py-2 text-sm text-parchment placeholder:text-parchment/35 focus:border-gold/60 focus:outline-none sm:max-w-sm"
            />
            <select
              value={patch}
              onChange={(e) => setPatch(e.target.value)}
              className="rounded-md border border-void-line bg-void-panel px-3 py-2 text-sm text-parchment focus:border-gold/60 focus:outline-none"
            >
              {patches.map((p) => (
                <option key={p} value={p}>
                  {p === "Todos" ? "Todos os patches" : p}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  category === c
                    ? "border-gold bg-gold/15 text-gold-bright"
                    : "border-void-line text-parchment/60 hover:border-gold/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="mb-3 text-xs text-parchment/40">
            {filtered.length} runeword{filtered.length !== 1 ? "s" : ""} encontrada
            {filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((rw) => (
              <RunewordCard
                key={rw.slug}
                rw={rw}
                runeImageMap={runeImageMap}
                onClick={() => openDetail(rw)}
              />
            ))}
          </div>
        </div>
      )}

      {tab === "calc" && (
        <div>
          <p className="mb-4 text-sm text-parchment/60">
            Toque em uma runa para marcar quantas voce possui. Vamos listar todas as
            Runewords que voce ja pode forjar. Lembre-se de inserir as runas no item
            na ordem correta da receita.
          </p>
          <div className="mb-8 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11">
            {runes.map((r) => {
              const n = counts[r.name] ?? 0;
              return (
                <button
                  key={r.name}
                  onClick={() => cycleCount(r.name)}
                  className={`relative flex flex-col items-center gap-1 rounded-md border p-2 transition-colors ${
                    n > 0
                      ? "border-rune-glow bg-rune/20"
                      : "border-void-line bg-void-panel hover:border-gold/40"
                  }`}
                >
                  <RuneIcon name={r.name} image={r.image} size={32} glowing={n > 0} />
                  <span className="text-[11px] text-parchment/70">{r.name}</span>
                  {n > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-void">
                      {n}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="divider-rune mb-6" />

          <h3 className="mb-3 font-display text-lg text-gold-bright">
            Runewords Forjaveis ({forgeable.length})
          </h3>
          {forgeable.length === 0 ? (
            <p className="text-sm text-parchment/40">
              Selecione as runas que voce tem para ver o que pode forjar.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {forgeable.map((rw) => (
                <RunewordCard
                  key={rw.slug}
                  rw={rw}
                  runeImageMap={runeImageMap}
                  onClick={() => openDetail(rw)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "table" && (
        <div className="overflow-x-auto rounded-lg border border-void-line">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-void-line bg-void-panel text-left text-xs uppercase tracking-wider text-parchment/50">
                <th className="px-3 py-2">Runa</th>
                <th className="px-3 py-2">Arma</th>
                <th className="px-3 py-2">Armadura / Elmo</th>
                <th className="px-3 py-2">Escudo</th>
                <th className="px-3 py-2">Nivel</th>
              </tr>
            </thead>
            <tbody>
              {runes.map((r) => (
                <tr
                  key={r.name}
                  className="border-b border-void-line/50 odd:bg-void-panel/40 hover:bg-void-raised/60"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2 font-medium text-gold-bright">
                      <RuneIcon name={r.name} image={r.image} size={24} />
                      {r.name}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-parchment/70">{r.weapon}</td>
                  <td className="px-3 py-2 text-parchment/70">{r.armorHelm}</td>
                  <td className="px-3 py-2 text-parchment/70">{r.shield}</td>
                  <td className="px-3 py-2 font-mono text-parchment/60">{r.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "cube" && (
        <div>
          <p className="mb-6 text-sm text-parchment/60">
            Receitas do Cubo Horadrico deste servidor para unir e dividir runas. A
            partir da Ohm, a uniao exige tambem uma unidade do catalisador indicado.
          </p>

          <h3 className="mb-3 font-display text-lg text-gold-bright">
            Unindo Runas (2 runas iguais = 1 runa superior)
          </h3>
          <div className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cubeData.union.map((u, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md border border-void-line bg-void-panel/60 px-3 py-2 text-sm"
              >
                <span className="font-mono text-xs text-parchment/40">2x</span>
                <RuneIcon name={u.from} image={runeImageMap[u.from] ?? ""} size={26} />
                <span className="text-parchment/50">{u.from}</span>
                {u.catalyst && (
                  <span className="rounded bg-blood/20 px-1.5 py-0.5 text-[10px] text-blood-bright">
                    + {u.catalyst}
                  </span>
                )}
                <span className="text-gold-bright">=</span>
                <RuneIcon name={u.to} image={runeImageMap[u.to] ?? ""} size={26} glowing />
                <span className="font-medium text-gold-bright">{u.to}</span>
              </div>
            ))}
          </div>

          <h3 className="mb-3 font-display text-lg text-gold-bright">
            Dividindo Runas Altas
          </h3>
          <p className="mb-4 text-xs text-parchment/40">
            Ohm em diante tambem podem ser divididas em duas runas do tier anterior,
            usando Standard of Heroes como catalisador (o processo nao e reversivel
            com a mesma eficiencia).
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cubeData.splitHigh.map((s, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-2 rounded-md border border-void-line bg-void-panel/60 px-3 py-2 text-sm"
              >
                <RuneIcon name={s.from} image={runeImageMap[s.from] ?? ""} size={26} glowing />
                <span className="font-medium text-gold-bright">{s.from}</span>
                <span className="rounded bg-blood/20 px-1.5 py-0.5 text-[10px] text-blood-bright">
                  + {s.catalystQty}x {s.catalyst}
                </span>
                <span className="text-gold-bright">=</span>
                {s.into.map((name, idx) => (
                  <span key={idx} className="flex items-center gap-1">
                    <RuneIcon name={name} image={runeImageMap[name] ?? ""} size={22} />
                    <span className="text-parchment/60">{name}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <RunewordDetailModal
          runeword={selected}
          runeImageMap={runeImageMap}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-gold text-void font-semibold"
          : "text-parchment/60 hover:bg-void-raised hover:text-gold-bright"
      }`}
    >
      {children}
    </button>
  );
}

function RunewordCard({
  rw,
  runeImageMap,
  onClick,
}: {
  rw: Runeword;
  runeImageMap: Record<string, string>;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 rounded-lg border border-void-line bg-void-panel/70 p-4 text-left transition-colors hover:border-gold/50 hover:bg-void-raised"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-display text-base text-gold-bright">{rw.name}</h4>
        <span className="rounded bg-void px-1.5 py-0.5 font-mono text-[11px] text-parchment/50">
          {rw.sockets}s
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {rw.runes.map((r, i) => (
          <RuneIcon key={i} name={r} image={runeImageMap[r] ?? ""} size={22} />
        ))}
      </div>
      <p className="text-xs text-parchment/50">{rw.itemTypes.join(", ")}</p>
      <p className="text-xs text-parchment/40">
        Nivel {rw.level} - {rw.patch}
      </p>
    </button>
  );
}
