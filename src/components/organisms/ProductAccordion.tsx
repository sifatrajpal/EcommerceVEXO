"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon, StarIcon } from "@/components/atoms/Icons";

const REVIEWS = [
  { name: "Amara K.", rating: 5, text: "Fits true to size and the fabric feels premium. I wear it to the gym and out after — doesn't look like gymwear at all." },
  { name: "Daniel R.", rating: 4, text: "Really comfortable and warm for winter runs. Only took a star off because the color ran slightly lighter than the photos." },
  { name: "Priya S.", rating: 5, text: "Ordered a size up like the size guide suggested and it's perfect. Already bought a second one in another color." },
];

const CARE_AND_DETAILS = [
  "Breathable cotton-poly blend with four-way stretch.",
  "Relaxed fit — true to size.",
  "Machine wash cold, tumble dry low.",
  "Do not bleach or dry clean.",
  "Designed in-house, ethically manufactured.",
];

function Row({ title, defaultOpen = false, action, children }: { title: string; defaultOpen?: boolean; action?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#e4e5e8]">
      <div className="flex items-center justify-between gap-[1cqw] py-[1.4cqw]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex flex-1 items-center justify-between text-left"
        >
          <span className="text-[clamp(15px,1.3cqw,20px)] font-bold">{title}</span>
          {!action && <ChevronDownIcon className={`size-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />}
        </button>

        {action && (
          <span className="flex items-center gap-[1cqw]">
            {action}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={`Toggle ${title}`}
              className="grid place-items-center"
            >
              <ChevronDownIcon className={`size-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
          </span>
        )}
      </div>
      {open && <div className="pb-[1.6cqw] text-[clamp(11px,0.95cqw,15px)] leading-[1.6] text-ink">{children}</div>}
    </div>
  );
}

export function ProductAccordion({ description }: { description: string }) {
  return (
    <div className="mt-[2.8cqw] border-t border-[#e4e5e8]">
      <Row
        title="Reviews"
        action={
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-md border border-ink px-[1.4cqw] py-[0.7cqw] text-[clamp(11px,0.85cqw,13px)] font-semibold transition-colors hover:bg-ink hover:text-white"
          >
            Write a review
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        }
      >
        <p className="mb-[1.2cqw] text-[clamp(13px,1.1cqw,18px)] font-bold">What customers say</p>
        <div className="flex flex-col gap-[1.2cqw]">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-[1cqw] bg-panel p-[1.4cqw]">
              <div className="flex items-center gap-[0.3cqw] text-[#f5a623]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < r.rating} className="size-3.5" />
                ))}
              </div>
              <p className="mt-[0.6cqw] text-[#3f4248]">{r.text}</p>
              <p className="mt-[0.6cqw] text-[12px] font-medium text-[#8e939a]">{r.name}</p>
            </div>
          ))}
        </div>
      </Row>

      <Row title="Size and fit">
        <p>
          This item fits true to size — we recommend ordering your usual size for a relaxed, everyday fit, or sizing
          down for something more fitted.
        </p>
        <a href="/size-guide" className="group mt-[0.8cqw] inline-flex items-center gap-1 font-semibold text-ink">
          See full size guide
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </Row>

      <Row title="Description">
        <p>{description}</p>
      </Row>

      <Row title="Details">
        <ul className="flex flex-col gap-[0.5cqw]">
          {CARE_AND_DETAILS.map((line) => (
            <li key={line} className="flex gap-[0.6cqw]">
              <span className="text-[#8e939a]">—</span>
              {line}
            </li>
          ))}
        </ul>
      </Row>
    </div>
  );
}
