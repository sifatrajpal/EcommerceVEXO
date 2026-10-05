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

const CROSSFADE_MS = 500;

/**
 * Pipeline: wrapper starts clipped (clip-path inset 100% from top) with the image zoomed in.
 * When in view → `.shown` → CSS transitions clip to 0 and zoom to 1 (see globals.css).
 *
 * If `src` changes later (e.g. a tab swap), the old picture stays put as a base layer while the
 * new one fades in on top of it via a CSS `@keyframes` animation (not a transition — a transition
 * needs a separately-painted "from" frame to interpolate from, which double-rAF didn't reliably
 * get us here; a keyframe animation's start state is atomic, so it always plays).
 */
export function RevealImage({ src, alt, className, imgClassName, sizes = "50vw", priority, delay = 0, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref);

  const [baseSrc, setBaseSrc] = useState(src);
  const [incoming, setIncoming] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (src === baseSrc) return;

    setIncoming(src);
    const timer = setTimeout(() => {
      setBaseSrc(src);
      setIncoming(null);
    }, CROSSFADE_MS);
    return () => clearTimeout(timer);
  }, [src, baseSrc]);

  return (
    <div ref={ref} className={cn("reveal overflow-hidden", shown && "shown", className)} style={{ "--rd": `${delay}s` } as CSSProperties}>
      <Image
        src={baseSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("reveal-img object-cover", imgClassName)}
      />
      {incoming && (
        <Image
          key={incoming}
          src={incoming}
          alt={alt}
          fill
          sizes={sizes}
          className={cn("reveal-img object-cover animate-fade", imgClassName)}
          style={{ animationDuration: `${CROSSFADE_MS}ms`, animationTimingFunction: "ease-in-out" }}
        />
      )}
      {children}
    </div>
  );
}
