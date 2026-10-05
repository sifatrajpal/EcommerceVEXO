"use client";

import { useActionState, useEffect, useState, type MouseEvent } from "react";
import { BagIcon } from "@/components/atoms/Icons";
import { addToCart, type AddToCartState } from "@/actions/cart";
import { cn } from "@/lib/utils";

const initial: AddToCartState = { status: "idle" };

/** Quick "add to bag" from a product card, without leaving the grid. */
export function QuickAddButton({ productId, className }: { productId: string; className?: string }) {
  const [state, formAction, pending] = useActionState(addToCart, initial);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (state.status !== "added") return;
    setJustAdded(true);
    const timer = setTimeout(() => setJustAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [state]);

  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <form action={formAction} onClick={stop} className={className}>
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        disabled={pending}
        aria-label="Add to bag"
        className={cn(
          "grid size-full place-items-center rounded-full bg-white transition-transform active:scale-90 disabled:opacity-60",
          justAdded && "text-[#3aa15c]",
        )}
      >
        <BagIcon className="w-[55%]" />
      </button>
    </form>
  );
}
