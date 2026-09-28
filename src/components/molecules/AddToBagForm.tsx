"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { addToCart, type AddToCartState } from "@/actions/cart";

const initial: AddToCartState = { status: "idle" };

type Props = { productId: string; children?: ReactNode; after?: ReactNode };

/** Quantity stepper (children) → submit button, which confirms once the item lands in the bag → trailing content (after), e.g. a wishlist button. */
export function AddToBagForm({ productId, children, after }: Props) {
  const [state, formAction, pending] = useActionState(addToCart, initial);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (state.status !== "added") return;
    setJustAdded(true);
    const timer = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [state]);

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
