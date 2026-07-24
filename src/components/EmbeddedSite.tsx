"use client";

import { useEffect, useState } from "react";

export default function EmbeddedSite({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [src]);

  function openInNewTab() {
    window.open(src, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-void-line bg-void-panel">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 bg-void-panel text-parchment/50">
          <span className="rune-socket h-4 w-4 animate-pulse bg-rune" />
          Carregando {title}...
        </div>
      )}

      {timedOut && !loaded && (
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 bg-blood/20 px-4 py-2 text-xs text-parchment/80">
          <span>
            A pagina esta demorando ou pode nao permitir ser exibida dentro do app.
          </span>
          <button
            type="button"
            onClick={openInNewTab}
            className="shrink-0 rounded border border-gold/50 px-2 py-1 text-gold-bright hover:bg-gold/10"
          >
            Abrir em nova aba
          </button>
        </div>
      )}

      <iframe
        key={src}
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        className="h-[80vh] w-full border-0 bg-white"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
