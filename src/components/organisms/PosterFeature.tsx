"use client";

import { useEffect, useRef } from "react";
import { Panel } from "@/components/atoms/Panel";
import { ScrollText } from "@/components/atoms/ScrollText";
import { RevealImage } from "@/components/atoms/RevealImage";

const ROWS = [
  { text: "FOR YOUR NEXT WORKOUT FOR YOUR NEXT", direction: -1 as const, offset: -0.02, top: "top-[17.2%]" },
  { text: "YOUR NEXT WORKOUT YOUR NEXT WORKOUT", direction: 1 as const, offset: -0.12, top: "top-[72%]" },
];

const LABELS = [
  { text: ["HOODIE & INNER", "SHORT THERMAL"], className: "left-[5%] top-[31%]" },
  { text: ["12/08/2024", "DELIVERY"], className: "right-[6%] top-[31%] text-right" },
  { text: ["FALL / WINTER", "2024"], className: "left-[6%] top-[79%] text-right" },
  { text: ["SHOCKS", "SHOE"], className: "right-[9%] top-[79%] text-ink before:absolute before:-left-[1cqw] before:top-[0.35cqw] before:size-[0.45cqw] before:rounded-full before:bg-ink" },
];

/**
 * The giant text is drawn twice:
 * 1) grey, behind the card, across the whole section
 * 2) white, inside the card (clipped by overflow-hidden)
 * The inside copy is shifted by the card's own offset so both line up perfectly.
 */
export function PosterFeature() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current, mirror = mirrorRef.current;
    const section = card?.parentElement;
    if (!card || !mirror || !section) return;
    const place = () => {
      Object.assign(mirror.style, {
        left: `${-card.offsetLeft}px`,
        top: `${-card.offsetTop}px`,
        width: `${section.clientWidth}px`,
        height: `${section.clientHeight}px`,
      });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(section);
    return () => ro.disconnect();
  }, []);

  return (
    <Panel data-scroll-section className="aspect-[927/561]">
      {ROWS.map((r) => (
        <ScrollText key={r.text} text={r.text} direction={r.direction} offset={r.offset} className={`${r.top} z-10 text-[10.2cqw] font-light text-ghost`} />
      ))}

      <div ref={cardRef} className="absolute top-[10.9%] left-[32.9%] z-20 h-[75.2%] w-[34.2%] overflow-hidden rounded-[1.9cqw]">
        <RevealImage src="/images/feature-athlete.png" alt="Model in a snake-print coat over a black turtleneck" sizes="35vw" className="absolute inset-0" />

        <div ref={mirrorRef} data-scroll-section aria-hidden className="pointer-events-none absolute z-10">
          {ROWS.map((r) => (
            <ScrollText key={r.text} text={r.text} direction={r.direction} offset={r.offset} className={`${r.top} text-[10.2cqw] font-light text-white/90`} />
          ))}
        </div>

        {LABELS.map((l) => (
          <p key={l.text[0]} className={`absolute z-20 text-[0.78cqw] leading-[1.15] text-white ${l.className}`}>
            {l.text[0]}<br />{l.text[1]}
          </p>
        ))}
      </div>
    </Panel>
  );
}
