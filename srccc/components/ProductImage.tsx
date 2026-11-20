"use client";

import { useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23e8f0ea'/%3E%3Cpath d='M320 190c-55 0-95 34-95 78 0 42 39 68 95 68s95-26 95-68c0-44-40-78-95-78zm-26-18a26 26 0 1 1 52 0 26 26 0 0 1-52 0z' fill='%2387a995'/%3E%3C/svg%3E";

export default function ProductImage({
  src,
  alt,
  className,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;

  return (
    <img
      src={failed ? FALLBACK_IMAGE : src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => {
        if (!failed) setFailedSrc(src);
      }}
    />
  );
}
