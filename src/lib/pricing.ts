/** Cookie that stores the currently-applied coupon code on the cart, read by the cart page and checkout action. */
export const COUPON_COOKIE = "vexo_coupon";

export type DiscountInput = { discountType: "percent" | "flat"; discountValue: number };

/** Dollar discount a coupon gives against a subtotal, clamped to [0, subtotal]. */
export function computeDiscount(subtotal: number, coupon: DiscountInput): number {
  const raw = coupon.discountType === "percent" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  return Math.min(Math.max(raw, 0), subtotal);
}
