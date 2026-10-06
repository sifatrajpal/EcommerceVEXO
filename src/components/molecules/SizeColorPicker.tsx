"use client";

import { useMemo, useState } from "react";
import { LOW_STOCK_THRESHOLD } from "@/lib/utils";
import type { Variant } from "@/lib/data/inventory";

type SizeOption = { id: string; name: string };
type ColorOption = { id: string; name: string; hex?: string };

type Props = {
  /** Real size→color stock for this product. Empty when the admin hasn't configured a matrix yet. */
  variants: Variant[];
  /** Catalog-wide fallbacks, shown as plain (non-stock-tracked) pickers when there's no matrix. */
  fallbackSizes: SizeOption[];
  fallbackColors: ColorOption[];
};

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"].map((name) => ({ id: name, name }));
const DEFAULT_COLORS = [
  { id: "sand", name: "Sand", hex: "#e4d9c6" },
  { id: "white", name: "White", hex: "#ffffff" },
  { id: "rust", name: "Rust", hex: "#b3542f" },
  { id: "black", name: "Black", hex: "#141414" },
];

export function SizeColorPicker({ variants, fallbackSizes, fallbackColors }: Props) {
  const trackStock = variants.length > 0;

  const sizes = useMemo(() => {
    if (!trackStock) {
      const base = fallbackSizes.length > 0 ? fallbackSizes : DEFAULT_SIZES;
      return base.map((s) => ({ ...s, quantity: 0 }));
    }
    const bySize = new Map<string, { id: string; name: string; quantity: number }>();
    for (const v of variants) {
      const existing = bySize.get(v.sizeId);
      bySize.set(v.sizeId, { id: v.sizeId, name: v.sizeName, quantity: (existing?.quantity ?? 0) + v.quantity });
    }
    return Array.from(bySize.values());
  }, [trackStock, variants, fallbackSizes]);

  const [selectedSizeId, setSelectedSizeId] = useState(sizes[Math.min(2, sizes.length - 1)]?.id ?? sizes[0]?.id);
  const selectedSize = sizes.find((s) => s.id === selectedSizeId);

  const colors = useMemo(() => {
    if (!trackStock) {
      const base = fallbackColors.length > 0 ? fallbackColors : DEFAULT_COLORS;
      return base.map((c) => ({ ...c, quantity: 0 }));
    }
    return variants
      .filter((v) => v.sizeId === selectedSizeId)
      .map((v) => ({ id: v.colorId, name: v.colorName, hex: v.hex, quantity: v.quantity }));
  }, [trackStock, variants, selectedSizeId, fallbackColors]);

  const [selectedColorId, setSelectedColorId] = useState(colors[0]?.id);
  const selectedColor = colors.find((c) => c.id === selectedColorId) ?? colors[0];

  return (
    <>
      <div className="mt-[0.6cqw]">
        <p className="mb-[0.6cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">SIZE</p>
        <div className="flex flex-wrap gap-[0.7cqw]">
          {sizes.map((size) => {
            const outOfStock = trackStock && size.quantity <= 0;
            return (
              <button
                key={size.id}
                type="button"
                disabled={outOfStock}
                onClick={() => setSelectedSizeId(size.id)}
                aria-pressed={selectedSizeId === size.id}
                className={`grid size-9 place-items-center rounded-full border text-[13px] transition-colors ${
                  selectedSizeId === size.id ? "border-ink bg-ink text-white" : "border-[#d8dade] text-[#6b7078] hover:border-ink"
                } ${outOfStock ? "cursor-not-allowed opacity-30 hover:border-[#d8dade]" : ""}`}
              >
                {size.name}
              </button>
            );
          })}
        </div>
        {trackStock && selectedSize && selectedSize.quantity > 0 && selectedSize.quantity < LOW_STOCK_THRESHOLD && (
          <p className="mt-[0.6cqw] text-[clamp(11px,0.85cqw,13px)] font-medium text-[#c23434]">
            Only {selectedSize.quantity} left in size {selectedSize.name} — order fast!
          </p>
        )}
        {trackStock && selectedSize && selectedSize.quantity <= 0 && (
          <p className="mt-[0.6cqw] text-[clamp(11px,0.85cqw,13px)] font-medium text-[#8e939a]">Size {selectedSize.name} is out of stock.</p>
        )}
      </div>

      <div>
        <p className="mb-[0.6cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">
          COLOR{trackStock && selectedSize ? ` — in size ${selectedSize.name}` : ""}
        </p>
        {colors.length === 0 ? (
          <p className="text-[clamp(11px,0.85cqw,13px)] text-[#8e939a]">No colors available in this size.</p>
        ) : (
          <div className="flex flex-wrap gap-[0.7cqw]">
            {colors.map((color) => {
              const outOfStock = trackStock && color.quantity <= 0;
              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.name}
                  disabled={outOfStock}
                  onClick={() => setSelectedColorId(color.id)}
                  aria-pressed={selectedColorId === color.id}
                  className={`relative size-[1.6cqw] min-h-6 min-w-6 rounded-full border transition-shadow ${
                    selectedColorId === color.id ? "border-ink ring-2 ring-ink ring-offset-2" : "border-[#e4e5e8]"
                  } ${outOfStock ? "cursor-not-allowed opacity-30" : ""}`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        )}
        {trackStock && selectedColor && selectedColor.quantity > 0 && selectedColor.quantity < LOW_STOCK_THRESHOLD && (
          <p className="mt-[0.6cqw] text-[clamp(11px,0.85cqw,13px)] font-medium text-[#c23434]">
            Only {selectedColor.quantity} left in {selectedColor.name} — order fast!
          </p>
        )}
        {trackStock && selectedColor && selectedColor.quantity <= 0 && (
          <p className="mt-[0.6cqw] text-[clamp(11px,0.85cqw,13px)] font-medium text-[#8e939a]">{selectedColor.name} is out of stock.</p>
        )}
      </div>
    </>
  );
}
