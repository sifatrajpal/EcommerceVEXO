"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { useInView } from "@/hooks/useInView";
import { charDelay, cn } from "@/lib/utils";

export type Tone = "default" | "muted" | "stripe";
export type Segment = { text: string; tone?: Tone };
/** A line is plain text, or segments with their own tone (e.g. one striped word). */
export type HeadingLine = string | Segment[];

type Props = { as?: ElementType; lines: HeadingLine[]; onDark?: boolean; className?: string; baseDelay?: number };

const toneClass: Record<Tone, string> = { default: "", muted: "tone-muted", stripe: "tone-stripe" };

/**
 * Pipeline: text → words → letters (<span class="char">), each with its own delay.
 * When the heading scrolls into view we add `.in`; CSS then animates every letter
 * hidden → striped → solid (see globals.css).
 */
export function AnimatedHeading({ as: Tag = "h2", lines, onDark, className, baseDelay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.35);
  let index = 0;

  const label = lines
    .map((line) => (typeof line === "string" ? line : line.map((s) => s.text).join("")))
    .join(" ");

  return (
    <Tag ref={ref} aria-label={label} className={cn("anim-heading", onDark && "on-dark", inView && "in", className)}>
      {lines.map((line, li) => {
        const segments = typeof line === "string" ? [{ text: line }] : line;
        return (
          <span key={li} aria-hidden className="block">
            {segments.map((seg, si) => (
              <span key={si} className={toneClass[seg.tone ?? "default"]}>
                {seg.text.split(/(\s+)/).map((word, wi) => {
                  if (!word) return null;
                  if (/^\s+$/.test(word)) return " ";
                  return (
                    <span key={wi} className="inline-block whitespace-nowrap">
                      {Array.from(word).map((char) => {
                        const i = index++;
                        return (
                          <span key={i} className="char" style={{ "--d": `${charDelay(i) + baseDelay}s` } as CSSProperties}>
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
