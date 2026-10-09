import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { ORDER_STATUSES } from "@/lib/orderStatus";

/**
 * Every query in this file relies on RLS ("... or exists (select 1 from admins ...)")
 * to only return real data to an admin — a non-admin caller gets empty results back,
 * not an error, so always double-check isCurrentUserAdmin() before rendering this.
 */

export type AdminStats = { totalRevenue: number; totalOrders: number; distinctCustomers: number; avgOrderValue: number };

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase.from("orders").select("total, user_id").returns<{ total: number | string; user_id: string }[]>();
  const orders = data ?? [];
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return {
    totalRevenue,
    totalOrders: orders.length,
    distinctCustomers: new Set(orders.map((o) => o.user_id)).size,
    avgOrderValue: orders.length ? totalRevenue / orders.length : 0,
  };
}

export type RecentOrder = { id: string; userEmail: string; total: number; currency: string; createdAt: string; itemCount: number };

export async function getRecentOrders(limit = 10): Promise<RecentOrder[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("orders")
    .select("id, user_email, total, currency, created_at, order_items(quantity)")
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<{ id: string; user_email: string; total: number | string; currency: string; created_at: string; order_items: { quantity: number }[] }[]>();

  return (data ?? []).map((o) => ({
    id: o.id,
    userEmail: o.user_email,
    total: Number(o.total),
    currency: o.currency,
    createdAt: o.created_at,
    itemCount: o.order_items.reduce((n, i) => n + i.quantity, 0),
  }));
}

export type TopProduct = { name: string; unitsSold: number; revenue: number };

/** Ranks products by units sold across every order ever placed. */
export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("order_items")
    .select("name, price, quantity")
    .returns<{ name: string; price: number | string; quantity: number }[]>();

  const byName = new Map<string, TopProduct>();
  for (const row of data ?? []) {
    const existing = byName.get(row.name) ?? { name: row.name, unitsSold: 0, revenue: 0 };
    existing.unitsSold += row.quantity;
    existing.revenue += Number(row.price) * row.quantity;
    byName.set(row.name, existing);
  }

  return [...byName.values()].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, limit);
}

export type CartActivity = { activeCarts: number; itemsInCarts: number };

/** Live snapshot of items sitting in shopping bags right now, across every customer. */
export async function getCartActivity(): Promise<CartActivity> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase.from("cart_items").select("user_id, quantity").returns<{ user_id: string; quantity: number }[]>();
  const rows = data ?? [];

  return {
    activeCarts: new Set(rows.map((r) => r.user_id)).size,
    itemsInCarts: rows.reduce((sum, r) => sum + r.quantity, 0),
  };
}

export async function getSubscriberCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase.from("subscribers").select("id", { count: "exact", head: true });
  return count ?? 0;
}

export type RevenueTrendPoint = { date: string; total: number };

/** Daily revenue for the last `days` days (today included), zero-filled on days with no orders. */
export async function getRevenueTrend(days = 30): Promise<RevenueTrendPoint[]> {
  const supabase = await createSupabaseServerClient();
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("orders")
    .select("total, created_at")
    .gte("created_at", since.toISOString())
    .returns<{ total: number | string; created_at: string }[]>();

  const byDay = new Map<string, number>();
  for (const row of data ?? []) {
    const day = row.created_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + Number(row.total));
  }

  const points: RevenueTrendPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    points.push({ date: key, total: byDay.get(key) ?? 0 });
  }
  return points;
}

export type OrderStatusCount = { status: string; count: number };

export async function getOrdersByStatus(): Promise<OrderStatusCount[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("orders").select("status").returns<{ status: string }[]>();

  const counts = new Map<string, number>();
  for (const row of data ?? []) counts.set(row.status, (counts.get(row.status) ?? 0) + 1);

  return ORDER_STATUSES.map((status) => ({ status, count: counts.get(status) ?? 0 }));
}

/** Orders placed in the last `hours` hours — powers the admin header's notification badge. */
export async function getRecentOrderCount(hours = 24): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const { count } = await supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", since);
  return count ?? 0;
}

export type AllOrder = RecentOrder & { status: string };

/** Full order history for the admin /admin/orders page (RLS already scopes this to an admin). */
export async function getAllOrders(limit = 200): Promise<AllOrder[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("orders")
    .select("id, user_email, total, currency, status, created_at, order_items(quantity)")
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<{ id: string; user_email: string; total: number | string; currency: string; status: string; created_at: string; order_items: { quantity: number }[] }[]>();

  return (data ?? []).map((o) => ({
    id: o.id,
    userEmail: o.user_email,
    total: Number(o.total),
    currency: o.currency,
    status: o.status,
    createdAt: o.created_at,
    itemCount: o.order_items.reduce((n, i) => n + i.quantity, 0),
  }));
}
