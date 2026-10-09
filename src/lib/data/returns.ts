import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

export type ReturnRequest = { id: string; orderId: string; reason: string; status: string; createdAt: string };

/** RLS scopes this to the return's owner or an admin — returns null otherwise or if none exists yet. */
export async function getReturnRequestForOrder(orderId: string): Promise<ReturnRequest | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("return_requests")
    .select("id, order_id, reason, status, created_at")
    .eq("order_id", orderId)
    .maybeSingle<{ id: string; order_id: string; reason: string; status: string; created_at: string }>();

  if (!data) return null;
  return { id: data.id, orderId: data.order_id, reason: data.reason, status: data.status, createdAt: data.created_at };
}
