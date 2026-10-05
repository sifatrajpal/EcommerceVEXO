"use client";

import { useState } from "react";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function SizeSelector({ sizes = DEFAULT_SIZES, defaultSize }: { sizes?: string[]; defaultSize?: string }) {
  const [selected, setSelected] = useState(defaultSize ?? sizes[Math.min(2, sizes.length - 1)] ?? sizes[0]);

  return (
    <div className="flex flex-wrap gap-[0.7cqw]">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => setSelected(size)}
          aria-pressed={selected === size}
          className={`grid size-9 place-items-center rounded-full border text-[13px] transition-colors ${
            selected === size ? "border-ink bg-ink text-white" : "border-[#d8dade] text-[#6b7078] hover:border-ink"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
