"use client";

import { useAddToCart } from "@/hooks/useAddToCart";

export function BuyItAgainButton({ productId }: { productId: string }) {
  const { formAction, pending, justAdded } = useAddToCart(productId, 1800);

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
