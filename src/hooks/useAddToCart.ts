"use client";

import { useActionState, useEffect, useState } from "react";
import { addToCart, type AddToCartState } from "@/actions/cart";

const initial: AddToCartState = { status: "idle" };

/**
 * Shared "add to bag" state machine — was copy-pasted identically into QuickAddButton,
 * AddToBagForm and BuyItAgainButton (same useActionState + justAdded timeout, only the
 * reset delay and markup differed). One hook, one place to fix if the add-to-cart flow
 * ever changes.
 */
export function useAddToCart(productId: string, resetDelayMs = 1800) {
  const [state, formAction, pending] = useActionState(addToCart, initial);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (state.status !== "added") return;
    setJustAdded(true);
    const timer = setTimeout(() => setJustAdded(false), resetDelayMs);
    return () => clearTimeout(timer);
  }, [state, resetDelayMs]);

  return { state, formAction, pending, justAdded, productId };
}
