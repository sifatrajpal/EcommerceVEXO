"use client";

import { deleteProduct } from "@/actions/admin-products";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Delete "${productName}"? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <button type="submit" className="text-[#c23434] underline hover:text-[#9c2828]">Delete</button>
    </form>
  );
}
