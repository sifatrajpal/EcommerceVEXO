import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

export type CartItem = {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number; currency: string; imageUrl: string };
};

type CartRow = {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number | string; currency: string; image_url: string } | null;
};

/**
 * The signed-in user's own cart, or an empty list when signed out. Filtered explicitly rather
 * than left to RLS alone — the "own cart select" policy also lets an admin see every user's
 * cart rows (for an admin dashboard), which would otherwise leak other shoppers' items onto
 * this personal cart page.
 */
export async function getCartItems(): Promise<CartItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products(id, name, price, currency, image_url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .returns<CartRow[]>();

  if (error || !data) {
    if (error) console.error("[getCartItems]", error.message);
    return [];
  }

  return data
    .filter((row): row is CartRow & { product: NonNullable<CartRow["product"]> } => row.product !== null)
    .map((row) => ({
      id: row.id,
      quantity: row.quantity,
      product: {
        id: row.product.id,
        name: row.product.name,
        price: Number(row.product.price),
        currency: row.product.currency,
        imageUrl: row.product.image_url,
      },
    }));
}
