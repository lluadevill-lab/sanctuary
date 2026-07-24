import BreakpointsCalculator from "@/components/BreakpointsCalculator";
import breakpointsData from "@/data/breakpoints.json";
import type { BreakpointTable } from "@/types";

export const metadata = { title: "Breakpoints | Sanctuary Codex" };

export default function BreakpointsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="rune-socket h-8 w-8 bg-gold shadow-gold" />
        <div>
          <p className="text-xs uppercase tracking-widest text-parchment/40">
            Build
          </p>
          <h1 className="font-display text-2xl text-gold-bright sm:text-3xl">
            Breakpoints
          </h1>
        </div>
      </div>
      <p className="mb-6 max-w-2xl text-sm text-parchment/60">
        Descubra em quantos frames sua build ataca, lanca magias ou bloqueia,
        e quanto falta para o proximo breakpoint. Dados especificos deste
        servidor, por classe.
      </p>
      <BreakpointsCalculator
        data={breakpointsData as unknown as Record<string, BreakpointTable>}
      />
    </div>
  );
}
