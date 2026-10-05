import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

export type OrderItem = { id: string; name: string; price: number; quantity: number };
export type Order = {
  id: string;
  userEmail: string;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

/** RLS scopes this to the order's owner or an admin — returns null otherwise. */
export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createSupabaseServerClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, user_email, total, currency, status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("id, name, price, quantity")
    .eq("order_id", id)
    .returns<{ id: string; name: string; price: number | string; quantity: number }[]>();

  return {
    id: order.id,
    userEmail: order.user_email,
    total: Number(order.total),
    currency: order.currency,
    status: order.status,
    createdAt: order.created_at,
    items: (items ?? []).map((i) => ({ id: i.id, name: i.name, price: Number(i.price), quantity: i.quantity })),
  };
}

export type OrderSummary = { id: string; total: number; currency: string; status: string; createdAt: string; itemCount: number };

/** The signed-in user's own order history — RLS already scopes `orders` to its owner. */
export async function getMyOrders(): Promise<OrderSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("id, total, currency, status, created_at, order_items(quantity)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<{ id: string; total: number | string; currency: string; status: string; created_at: string; order_items: { quantity: number }[] }[]>();

  return (data ?? []).map((o) => ({
    id: o.id,
    total: Number(o.total),
    currency: o.currency,
    status: o.status,
    createdAt: o.created_at,
    itemCount: o.order_items.reduce((n, i) => n + i.quantity, 0),
  }));
}
