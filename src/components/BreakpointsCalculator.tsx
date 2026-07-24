"use client";

import { useMemo, useState } from "react";
import type { BreakpointRow, BreakpointTable } from "@/types";

type StatKey = "fcr" | "fhr" | "fbr";

const STAT_LABELS: Record<StatKey, string> = {
  fcr: "Faster Cast Rate (FCR)",
  fhr: "Faster Hit Recovery (FHR)",
  fbr: "Faster Block Rate (FBR)",
};

function findBreakpoint(table: BreakpointRow[], pct: number) {
  const sorted = [...table].sort((a, b) => a[0] - b[0]);
  let current = sorted[0];
  let next: BreakpointRow | null = null;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i][0] <= pct) {
      current = sorted[i];
      next = sorted[i + 1] ?? null;
    }
  }
  return { current, next };
}

export default function BreakpointsCalculator({
  data,
}: {
  data: Record<string, BreakpointTable>;
}) {
  const classNames = Object.keys(data);
  const [className, setClassName] = useState(classNames[0]);
  const [stat, setStat] = useState<StatKey>("fcr");
  const [pct, setPct] = useState<number>(0);

  const classData = data[className];
  const variants = Object.keys(classData[stat]);
  const [variant, setVariant] = useState(variants[0]);

  const activeVariants = useMemo(() => Object.keys(classData[stat]), [classData, stat]);
  const currentVariant = activeVariants.includes(variant) ? variant : activeVariants[0];
  const table = classData[stat][currentVariant];

  const { current, next } = useMemo(() => findBreakpoint(table, pct), [table, pct]);

  function handleClassChange(name: string) {
    setClassName(name);
    const newVariants = Object.keys(data[name][stat]);
    setVariant(newVariants[0]);
  }

  function handleStatChange(s: StatKey) {
    setStat(s);
    const newVariants = Object.keys(classData[s]);
    setVariant(newVariants[0]);
  }

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-parchment/50">
            Classe
          </label>
          <select
            value={className}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full rounded-md border border-void-line bg-void-panel px-3 py-2 text-sm text-parchment focus:border-gold/60 focus:outline-none"
          >
            {classNames.map((c) => (
              <option key={c} value={c}>
                {data[c].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-parchment/50">
            Estatistica
          </label>
          <select
            value={stat}
            onChange={(e) => handleStatChange(e.target.value as StatKey)}
            className="w-full rounded-md border border-void-line bg-void-panel px-3 py-2 text-sm text-parchment focus:border-gold/60 focus:outline-none"
          >
            {(Object.keys(STAT_LABELS) as StatKey[]).map((s) => (
              <option key={s} value={s}>
                {STAT_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeVariants.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeVariants.map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                currentVariant === v
                  ? "border-gold bg-gold/15 text-gold-bright"
                  : "border-void-line text-parchment/60 hover:border-gold/40"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      <div className="mb-8 flex items-center gap-3">
        <label className="text-sm text-parchment/60" htmlFor="pct-input">
          Seu {STAT_LABELS[stat].split(" (")[0]} atual:
        </label>
        <input
          id="pct-input"
          type="number"
          min={0}
          value={pct}
          onChange={(e) => setPct(Math.max(0, Number(e.target.value) || 0))}
          className="w-24 rounded-md border border-void-line bg-void px-3 py-2 text-sm text-parchment focus:border-gold/60 focus:outline-none"
        />
        <span className="text-sm text-parchment/60">%</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gold/40 bg-gold/10 p-5">
          <p className="text-xs uppercase tracking-wide text-parchment/50">
            Breakpoint atual
          </p>
          <p className="mt-1 font-display text-3xl text-gold-bright">
            {current[1]} <span className="text-base font-body text-parchment/50">frames</span>
          </p>
          <p className="mt-1 text-xs text-parchment/40">
            a partir de {current[0]}% de {stat.toUpperCase()}
          </p>
        </div>

        <div className="rounded-lg border border-void-line bg-void-panel/60 p-5">
          <p className="text-xs uppercase tracking-wide text-parchment/50">
            Proximo breakpoint
          </p>
          {next ? (
            <>
              <p className="mt-1 font-display text-3xl text-parchment/80">
                {next[1]} <span className="text-base font-body text-parchment/50">frames</span>
              </p>
              <p className="mt-1 text-xs text-parchment/40">
                precisa de {next[0]}% (faltam {Math.max(0, next[0] - pct)}%)
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-parchment/40">
              Voce ja esta no breakpoint mais rapido possivel.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-void-line">
        <table className="w-full min-w-[300px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-void-line bg-void-panel text-left text-xs uppercase tracking-wider text-parchment/50">
              <th className="px-3 py-2">% Necessario</th>
              <th className="px-3 py-2">Frames</th>
            </tr>
          </thead>
          <tbody>
            {[...table]
              .sort((a, b) => a[0] - b[0])
              .map(([p, frames], i) => (
                <tr
                  key={i}
                  className={`border-b border-void-line/50 ${
                    p === current[0]
                      ? "bg-gold/15 text-gold-bright"
                      : "odd:bg-void-panel/40 text-parchment/70"
                  }`}
                >
                  <td className="px-3 py-2 font-mono">{p}%</td>
                  <td className="px-3 py-2 font-mono">{frames}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
