"use client";

import { useState } from "react";

const SIZES = ["S", "M", "L", "XL"];

export function SizeSelector({ defaultSize = "M" }: { defaultSize?: string }) {
  const [selected, setSelected] = useState(defaultSize);

  return (
    <div className="flex gap-[0.7cqw]">
      {SIZES.map((size) => (
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
