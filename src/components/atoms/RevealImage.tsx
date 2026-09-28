"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type ReactNode } from "react";
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
  /** Change to remount only the <Image> (used for tab swaps → fades in). */
  imageKey?: string;
  /** Overlays (labels, buttons) that reveal together with the picture. */
  children?: ReactNode;
};

/**
 * Pipeline: wrapper starts clipped (clip-path inset 100% from top) with the image zoomed in.
 * When in view → `.shown` → CSS transitions clip to 0 and zoom to 1 (see globals.css).
 */
export function RevealImage({ src, alt, className, imgClassName, sizes = "50vw", priority, delay = 0, imageKey, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref);

  return (
    <div ref={ref} className={cn("reveal overflow-hidden", shown && "shown", className)} style={{ "--rd": `${delay}s` } as CSSProperties}>
      <Image key={imageKey} src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("reveal-img object-cover", imgClassName)} />
      {children}
    </div>
  );
}
