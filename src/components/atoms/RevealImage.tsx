"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Wrapper classes. Include position (relative/absolute) and size here. */
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Stagger in seconds. */
  delay?: number;
  /** Overlays (labels, buttons) that reveal together with the picture. */
  children?: ReactNode;
};

const SWAP_FADE_MS = 700;

/**
 * Pipeline: wrapper starts clipped (clip-path inset 100% from top) with the image zoomed in.
 * When in view → `.shown` → CSS transitions clip to 0 and zoom to 1 (see globals.css).
 *
 * If `src` changes later (e.g. a tab swap), the picture fades out, swaps, then fades back in
 * instead of jumping straight to the new image.
 */
export function RevealImage({ src, alt, className, imgClassName, sizes = "50vw", priority, delay = 0, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref);

  const [displayedSrc, setDisplayedSrc] = useState(src);
  const [fadingOut, setFadingOut] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (src === displayedSrc) return;
    setFadingOut(true);
    const timer = setTimeout(() => {
      setDisplayedSrc(src);
      setFadingOut(false);
    }, SWAP_FADE_MS);
    return () => clearTimeout(timer);
  }, [src, displayedSrc]);

  return (
    <div ref={ref} className={cn("reveal overflow-hidden", shown && "shown", className)} style={{ "--rd": `${delay}s` } as CSSProperties}>
      <Image
        src={displayedSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "reveal-img object-cover transition-opacity duration-700 ease-in-out",
          fadingOut ? "opacity-0" : "opacity-100",
          imgClassName,
        )}
      />
      {children}
    </div>
  );
}
