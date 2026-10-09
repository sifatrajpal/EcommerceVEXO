import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

export type Coupon = {
  id: string;
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
};

type CouponRow = {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number | string;
  active: boolean;
  expires_at: string | null;
  created_at: string;
};

function mapRow(row: CouponRow): Coupon {
  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type as "percent" | "flat",
    discountValue: Number(row.discount_value),
    active: row.active,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

/** Every coupon, newest first — for the admin coupons list. */
export async function getCoupons(): Promise<Coupon[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("coupons")
    .select("id, code, discount_type, discount_value, active, expires_at, created_at")
    .order("created_at", { ascending: false })
    .returns<CouponRow[]>();

  return (data ?? []).map(mapRow);
}

/** Looks up a coupon by code and returns it only if active and not expired — used to validate a code at apply-time and again at checkout. */
export async function getActiveCouponByCode(code: string): Promise<Coupon | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("coupons")
    .select("id, code, discount_type, discount_value, active, expires_at, created_at")
    .ilike("code", code)
    .maybeSingle<CouponRow>();

  if (!data || !data.active) return null;
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) return null;
  return mapRow(data);
}
