"use client";

import { useState } from "react";
import { LOW_STOCK_THRESHOLD } from "@/lib/utils";
import type { StockOption } from "@/lib/data/inventory";

type Props = { colors: StockOption[]; trackStock?: boolean };

export function ColorSelector({ colors, trackStock = false }: Props) {
  const [selectedId, setSelectedId] = useState(colors[0]?.id);
  const selected = colors.find((c) => c.id === selectedId);

  return (
    <div>
      <div className="flex flex-wrap gap-[0.7cqw]">
        {colors.map((color) => {
          const outOfStock = trackStock && color.quantity <= 0;
          return (
            <button
              key={color.id}
              type="button"
              title={color.name}
              disabled={outOfStock}
              onClick={() => setSelectedId(color.id)}
              aria-pressed={selectedId === color.id}
              className={`relative size-[1.6cqw] min-h-6 min-w-6 rounded-full border transition-shadow ${
                selectedId === color.id ? "border-ink ring-2 ring-ink ring-offset-2" : "border-[#e4e5e8]"
              } ${outOfStock ? "cursor-not-allowed opacity-30" : ""}`}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
      {trackStock && selected && selected.quantity > 0 && selected.quantity < LOW_STOCK_THRESHOLD && (
        <p className="mt-[0.6cqw] text-[clamp(11px,0.85cqw,13px)] font-medium text-[#c23434]">
          Only {selected.quantity} left in {selected.name} — order fast!
        </p>
      )}
      {trackStock && selected && selected.quantity <= 0 && (
        <p className="mt-[0.6cqw] text-[clamp(11px,0.85cqw,13px)] font-medium text-[#8e939a]">{selected.name} is out of stock.</p>
      )}
    </div>
  );
}
