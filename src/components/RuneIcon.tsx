"use client";

import Image from "next/image";
import { useState } from "react";

export default function RuneIcon({
  name,
  image,
  size = 32,
  glowing = false,
}: {
  name: string;
  image: string;
  size?: number;
  glowing?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span
        className={`rune-socket flex shrink-0 items-center justify-center bg-void-raised text-[9px] font-bold text-parchment/60 ${
          glowing ? "shadow-rune" : ""
        }`}
        style={{ width: size, height: size }}
        title={name}
      >
        {name.slice(0, 2)}
      </span>
    );
  }

  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded ${glowing ? "shadow-rune" : ""}`}
      style={{ width: size, height: size }}
      title={name}
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes={`${size}px`}
        className="object-contain"
        unoptimized
        onError={() => setErrored(true)}
      />
    </span>
  );
}
