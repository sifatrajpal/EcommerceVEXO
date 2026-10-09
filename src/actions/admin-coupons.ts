"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { isCurrentUserAdmin } from "@/lib/admin";

export type CreateCouponState = { status: "idle" | "success" | "error"; message?: string };

export async function createCoupon(_prev: CreateCouponState, formData: FormData): Promise<CreateCouponState> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) return { status: "error", message: "Not authorized." };

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const discountType = String(formData.get("discountType") ?? "percent");
  const discountValue = Number(formData.get("discountValue"));
  const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();

  if (!code) return { status: "error", message: "Enter a coupon code." };
  if (!["percent", "flat"].includes(discountType)) return { status: "error", message: "Invalid discount type." };
  if (!Number.isFinite(discountValue) || discountValue <= 0) return { status: "error", message: "Enter a valid discount amount." };
  if (discountType === "percent" && discountValue > 100) return { status: "error", message: "Percent discount can't exceed 100." };

  const { error } = await supabase.from("coupons").insert({
    code,
    discount_type: discountType,
    discount_value: discountValue,
    expires_at: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
  });

  if (error) {
    const message = error.code === "23505" ? "That coupon code already exists." : "Couldn't create that coupon.";
    return { status: "error", message };
  }

  revalidatePath("/admin/coupons");
  return { status: "success", message: `Coupon "${code}" created.` };
}

export async function toggleCoupon(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) redirect("/admin/coupons");

  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  if (!id) return;

  await supabase.from("coupons").update({ active: !active }).eq("id", id);
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) redirect("/admin/coupons");

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("coupons").delete().eq("id", id);
  revalidatePath("/admin/coupons");
}
