"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Main photo + thumbnail rail. Thumbnails only render once a product has more
 * than one image — right now every product has exactly one real photo, so the
 * rail is dormant until back/side shots are added to the data.
 */
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8cqw] bg-panel">
        <Image src={images[active]} alt={alt} fill priority sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mt-[1cqw] flex gap-[0.8cqw]">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square w-[4.5cqw] min-w-14 overflow-hidden rounded-[0.8cqw] border-2",
                i === active ? "border-ink" : "border-transparent"
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
