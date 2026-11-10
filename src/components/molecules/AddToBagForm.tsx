"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { useAddToCart } from "@/hooks/useAddToCart";

type Props = { productId: string; children?: ReactNode; after?: ReactNode };

/** Quantity stepper (children) → submit button, which confirms once the item lands in the bag → trailing content (after), e.g. a wishlist button. */
export function AddToBagForm({ productId, children, after }: Props) {
  const { state, formAction, pending, justAdded } = useAddToCart(productId, 1800);

  return (
    <form action={formAction} className="mt-[1cqw] flex items-center gap-[1.2cqw]">
      <input type="hidden" name="productId" value={productId} />
      {children}
      <Button type="submit" disabled={pending} className="flex-1 disabled:opacity-60">
        {pending ? "ADDING…" : justAdded ? "ADDED ✓" : "ADD TO BAG"}
      </Button>
      {after}
      {state.status === "error" && <p className="text-[12px] text-[#c23434]">{state.message}</p>}
    </form>
  );
}
