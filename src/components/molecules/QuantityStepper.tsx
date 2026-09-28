"use client";

import { useState } from "react";

export function QuantityStepper({ name = "quantity" }: { name?: string }) {
  const [qty, setQty] = useState(1);

  return (
    <div className="flex items-center gap-[0.7cqw]">
      <input type="hidden" name={name} value={qty} />
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className="grid size-9 place-items-center rounded-full border border-[#d8dade] text-[16px] hover:bg-panel"
      >
        −
      </button>
      <span className="w-6 text-center text-[15px]">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => setQty((q) => q + 1)}
        className="grid size-9 place-items-center rounded-full border border-[#d8dade] text-[16px] hover:bg-panel"
      >
        +
      </button>
    </div>
  );
}
