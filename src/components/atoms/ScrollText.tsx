"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  /** -1 moves left while scrolling down, 1 moves right. */
  direction?: 1 | -1;
  /** Starting offset as a fraction of the section width. */
  offset?: number;
  className?: string;
};

/**
 * Giant background text that slides sideways with scroll.
 * Pipeline: scroll → rAF → progress p (0 when the section enters, 1 when it leaves)
 * → translateX written straight to the DOM (no React re-render per frame).
 * The section is the closest ancestor with [data-scroll-section].
 */
export function ScrollText({ text, direction = -1, offset = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const section = (el.closest("[data-scroll-section]") as HTMLElement) ?? el.parentElement!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      const w = section.clientWidth;
      const move = reduce ? 0 : (p - 0.5) * direction * w * 0.35;
      el.style.transform = `translateX(${offset * w + move}px)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [direction, offset]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute left-0 whitespace-nowrap leading-none tracking-[-0.01em] [font-stretch:125%] will-change-transform", className)}
    >
      {text}
    </div>
  );
}
