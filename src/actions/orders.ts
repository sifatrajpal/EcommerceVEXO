"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { isCurrentUserAdmin } from "@/lib/admin";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orderStatus";

/** Admin-only: changes an order's status from the dropdown on /admin/orders. */
export async function updateOrderStatus(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) redirect("/admin/orders");

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!orderId || !ORDER_STATUSES.includes(status as OrderStatus)) return;

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) console.error("[updateOrderStatus]", error.message);

  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/account");
}
