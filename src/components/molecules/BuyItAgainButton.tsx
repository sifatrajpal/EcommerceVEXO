"use client";

import { useActionState, useEffect, useState } from "react";
import { addToCart, type AddToCartState } from "@/actions/cart";

const initial: AddToCartState = { status: "idle" };

export function BuyItAgainButton({ productId }: { productId: string }) {
  const [state, formAction, pending] = useActionState(addToCart, initial);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (state.status !== "added") return;
    setJustAdded(true);
    const timer = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#ffd814] px-4 py-1.5 text-[13px] font-medium transition-colors hover:bg-[#f7ca00] disabled:opacity-60"
      >
        {pending ? "Adding…" : justAdded ? "Added ✓" : "Buy It Again"}
      </button>
    </form>
  );
}
