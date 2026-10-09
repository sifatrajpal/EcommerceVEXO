"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

export type ReturnState = { status: "idle" | "success" | "error"; message?: string };

/** Submits a return request for one of the signed-in user's own orders (RLS enforces ownership). */
export async function requestReturn(_prev: ReturnState, formData: FormData): Promise<ReturnState> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const orderId = String(formData.get("orderId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!orderId) return { status: "error", message: "Missing order." };
  if (!reason) return { status: "error", message: "Tell us why you're returning this order." };

  const { error } = await supabase.from("return_requests").insert({ order_id: orderId, user_id: user.id, reason });

  if (error) {
    const message = error.code === "23505" ? "You've already requested a return for this order." : "Couldn't submit that return request.";
    return { status: "error", message };
  }

  revalidatePath("/returns");
  revalidatePath(`/orders/${orderId}`);
  return { status: "success", message: "Return request submitted — we'll email you a prepaid label shortly." };
}
