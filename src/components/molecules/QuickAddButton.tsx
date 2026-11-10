"use client";

import type { MouseEvent } from "react";
import { BagIcon } from "@/components/atoms/Icons";
import { useAddToCart } from "@/hooks/useAddToCart";
import { cn } from "@/lib/utils";

/** Quick "add to bag" from a product card, without leaving the grid. */
export function QuickAddButton({ productId, className }: { productId: string; className?: string }) {
  const { formAction, pending, justAdded } = useAddToCart(productId, 1500);

  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <form action={formAction} onClick={stop} className={className}>
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        disabled={pending}
        aria-label="Add to bag"
        className={cn(
          "grid size-full place-items-center rounded-full bg-white text-[#141414] transition-transform active:scale-90 disabled:opacity-60",
          justAdded && "text-[#3aa15c]",
        )}
      >
        <BagIcon className="w-[55%]" />
      </button>
    </form>
  );
}
