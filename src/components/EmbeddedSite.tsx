"use client";

import { useEffect, useRef, useState } from "react";

export default function EmbeddedSite({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setTimedOut(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-void-line bg-void-panel">
      {!loaded && (
        <div className="flex h-[70vh] items-center justify-center gap-3 text-parchment/50">
          <span className="rune-socket h-4 w-4 animate-pulse bg-rune" />
          Carregando {title}...
        </div>
      )}
      {timedOut && !loaded && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-blood/20 px-4 py-2 text-xs text-parchment/80">
          <span>
            A página está demorando ou pode não permitir ser exibida dentro do app.
          </span>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded border border-gold/50 px-2 py-1 text-gold-bright hover:bg-gold/10"
          >
            Abrir em nova aba ↗
          </a>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        className={`h-[80vh] w-full border-0 bg-white ${loaded ? "block" : "hidden"}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
