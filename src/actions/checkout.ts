"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { DELIVERY_FEE } from "@/lib/utils";

/**
 * Records the current cart as a placed order (no real payment gateway — this
 * is a checkout stand-in, not card processing). Clears the cart on success.
 */
export async function placeOrder() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: items, error: cartError } = await supabase
    .from("cart_items")
    .select("quantity, product:products(id, name, price)")
    .eq("user_id", user.id)
    .returns<{ quantity: number; product: { id: string; name: string; price: number | string } | null }[]>();

  if (cartError || !items?.length) redirect("/cart");

  const validItems = items.filter((i): i is typeof i & { product: NonNullable<typeof i.product> } => i.product !== null);
  if (!validItems.length) redirect("/cart");

  const total = validItems.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0) + DELIVERY_FEE;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: user.id, user_email: user.email, total })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[placeOrder]", orderError?.message);
    redirect("/cart");
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    validItems.map((i) => ({
      order_id: order.id,
      product_id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }))
  );
  if (itemsError) console.error("[placeOrder items]", itemsError.message);

  await supabase.from("cart_items").delete().eq("user_id", user.id);

  revalidatePath("/", "layout");
  redirect(`/orders/${order.id}`);
}
