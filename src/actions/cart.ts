"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  return { supabase, user };
}

export type AddToCartState = { status: "idle" | "added" | "error"; message?: string };

export async function addToCart(_prev: AddToCartState, formData: FormData): Promise<AddToCartState> {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return { status: "error", message: "Missing product." };
  const qty = Math.max(1, Number(formData.get("quantity") ?? 1));

  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("cart_items").insert({ user_id: user.id, product_id: productId, quantity: qty });
  if (error) {
    if (error.code === "23505") {
      // Already in the cart — bump quantity instead of a duplicate row.
      const { data } = await supabase.from("cart_items").select("quantity").eq("user_id", user.id).eq("product_id", productId).single();
      if (data) await supabase.from("cart_items").update({ quantity: data.quantity + qty }).eq("user_id", user.id).eq("product_id", productId);
    } else {
      console.error("[addToCart]", error.message);
      return { status: "error", message: "Couldn't add that to your bag." };
    }
  }
  revalidatePath("/", "layout");
  return { status: "added" };
}

export async function updateCartQuantity(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);
  const { supabase } = await requireUser();

  if (quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", itemId);
  } else {
    await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
  }
  revalidatePath("/", "layout");
}

export async function removeFromCart(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase } = await requireUser();

  await supabase.from("cart_items").delete().eq("id", itemId);
  revalidatePath("/", "layout");
}

export async function clearCart() {
  const { supabase, user } = await requireUser();

  await supabase.from("cart_items").delete().eq("user_id", user.id);
  revalidatePath("/", "layout");
}
