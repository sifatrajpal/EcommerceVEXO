"use client";

import { useState } from "react";
import { StarIcon } from "@/components/atoms/Icons";

const TABS = ["Description", "Care", "Reviews"] as const;
type Tab = (typeof TABS)[number];

const CARE_INSTRUCTIONS = [
  "Machine wash cold with like colors.",
  "Do not bleach.",
  "Tumble dry low, or hang dry to extend fabric life.",
  "Warm iron if needed — avoid direct heat on any printed graphics.",
  "Do not dry clean.",
];

const REVIEWS = [
  { name: "Amara K.", rating: 5, text: "Fits true to size and the fabric feels premium. I wear it to the gym and out after — doesn't look like gymwear at all." },
  { name: "Daniel R.", rating: 4, text: "Really comfortable and warm for winter runs. Only took a star off because the color ran slightly lighter than the photos." },
  { name: "Priya S.", rating: 5, text: "Ordered a size up like the size guide suggested and it's perfect. Already bought a second one in another color." },
];

export function ProductInfoTabs({ description }: { description: string }) {
  const [active, setActive] = useState<Tab>("Description");

  return (
    <div className="mt-[2.8cqw]">
      <div className="flex gap-[1.8cqw] border-b border-[#e4e5e8]">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            aria-pressed={active === tab}
            className={`-mb-px border-b-2 pb-[0.8cqw] text-[clamp(11px,0.9cqw,14px)] font-medium transition-colors ${
              active === tab ? "border-ink text-ink" : "border-transparent text-[#8e939a] hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-[1.8cqw] text-[clamp(11px,0.9cqw,14px)] leading-[1.6] text-ink">
        {active === "Description" && <p>{description}</p>}

        {active === "Care" && (
          <ul className="flex flex-col gap-[0.6cqw]">
            {CARE_INSTRUCTIONS.map((line) => (
              <li key={line} className="flex gap-[0.6cqw]">
                <span className="text-[#8e939a]">—</span>
                {line}
              </li>
            ))}
          </ul>
        )}

        {active === "Reviews" && (
          <div>
            <p className="mb-[1.4cqw] text-[clamp(13px,1.1cqw,18px)] font-medium">What customers say</p>
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
          </div>
        )}
      </div>
    </div>
  );
}
