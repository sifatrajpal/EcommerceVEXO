"use client";

import { useState } from "react";
import { LOW_STOCK_THRESHOLD } from "@/lib/utils";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"].map((name) => ({ id: name, name, quantity: 0 }));

type SizeOption = { id: string; name: string; quantity: number };

type Props = { sizes?: SizeOption[]; trackStock?: boolean; defaultSize?: string };

export function SizeSelector({ sizes = DEFAULT_SIZES, trackStock = false, defaultSize }: Props) {
  const [selectedId, setSelectedId] = useState(
    (defaultSize && sizes.find((s) => s.name === defaultSize)?.id) ?? sizes[Math.min(2, sizes.length - 1)]?.id ?? sizes[0]?.id,
  );
  const selected = sizes.find((s) => s.id === selectedId);

  return (
    <div>
      <div className="flex flex-wrap gap-[0.7cqw]">
        {sizes.map((size) => {
          const outOfStock = trackStock && size.quantity <= 0;
          return (
            <button
              key={size.id}
              type="button"
              disabled={outOfStock}
              onClick={() => setSelectedId(size.id)}
              aria-pressed={selectedId === size.id}
              className={`grid size-9 place-items-center rounded-full border text-[13px] transition-colors ${
                selectedId === size.id ? "border-ink bg-ink text-white" : "border-[#d8dade] text-[#6b7078] hover:border-ink"
              } ${outOfStock ? "cursor-not-allowed opacity-30 hover:border-[#d8dade]" : ""}`}
            >
              {size.name}
            </button>
          );
        })}
      </div>
      {trackStock && selected && selected.quantity > 0 && selected.quantity < LOW_STOCK_THRESHOLD && (
        <p className="mt-[0.6cqw] text-[clamp(11px,0.85cqw,13px)] font-medium text-[#c23434]">
          Only {selected.quantity} left in size {selected.name} — order fast!
        </p>
      )}
      {trackStock && selected && selected.quantity <= 0 && (
        <p className="mt-[0.6cqw] text-[clamp(11px,0.85cqw,13px)] font-medium text-[#8e939a]">Size {selected.name} is out of stock.</p>
      )}
    </div>
  );
}
