"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getActiveCouponByCode } from "@/lib/data/coupons";
import { COUPON_COOKIE } from "@/lib/pricing";

export type CouponState = { status: "idle" | "success" | "error"; message?: string };

/** Validates a coupon code typed into the cart and, if valid, remembers it in a cookie for checkout. */
export async function applyCoupon(_prev: CouponState, formData: FormData): Promise<CouponState> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { status: "error", message: "Enter a coupon code." };

  const coupon = await getActiveCouponByCode(code);
  if (!coupon) return { status: "error", message: "That coupon code isn't valid or has expired." };

  const jar = await cookies();
  jar.set(COUPON_COOKIE, coupon.code, { path: "/", maxAge: 60 * 60 * 24 * 7 });

  revalidatePath("/cart");
  return { status: "success", message: `"${coupon.code}" applied!` };
}

export async function removeCoupon(): Promise<void> {
  const jar = await cookies();
  jar.delete(COUPON_COOKIE);
  revalidatePath("/cart");
}
