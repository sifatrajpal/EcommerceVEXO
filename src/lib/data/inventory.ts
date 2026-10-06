import "server-only";
import { getSupabase } from "@/lib/supabase/server";

export type StockOption = { id: string; name: string; quantity: number; hex?: string };

type ColorStockRow = { quantity: number; colors: { id: string; name: string; hex: string } | null };
type SizeStockRow = { quantity: number; sizes: { id: string; name: string } | null };

export async function getProductColorStock(productId: string): Promise<StockOption[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("product_colors")
    .select("quantity, colors(id, name, hex)")
    .eq("product_id", productId)
    .returns<ColorStockRow[]>();

  if (error || !data) return [];
  return data.filter((r) => r.colors).map((r) => ({ id: r.colors!.id, name: r.colors!.name, hex: r.colors!.hex, quantity: r.quantity }));
}

export async function getProductSizeStock(productId: string): Promise<StockOption[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("product_sizes")
    .select("quantity, sizes(id, name)")
    .eq("product_id", productId)
    .returns<SizeStockRow[]>();

  if (error || !data) return [];
  return data.filter((r) => r.sizes).map((r) => ({ id: r.sizes!.id, name: r.sizes!.name, quantity: r.quantity }));
}

type AllColorStockRow = { product_id: string; quantity: number; colors: { id: string; name: string; hex: string } | null };
type AllSizeStockRow = { product_id: string; quantity: number; sizes: { id: string; name: string } | null };

/** Bulk-fetches every product's color stock in one query, for the admin products list. */
export async function getAllColorStock(): Promise<Map<string, StockOption[]>> {
  const supabase = getSupabase();
  const map = new Map<string, StockOption[]>();
  if (!supabase) return map;

  const { data, error } = await supabase
    .from("product_colors")
    .select("product_id, quantity, colors(id, name, hex)")
    .returns<AllColorStockRow[]>();

  if (error || !data) return map;
  for (const row of data) {
    if (!row.colors) continue;
    const list = map.get(row.product_id) ?? [];
    list.push({ id: row.colors.id, name: row.colors.name, hex: row.colors.hex, quantity: row.quantity });
    map.set(row.product_id, list);
  }
  return map;
}

/** Bulk-fetches every product's size stock in one query, for the admin products list. */
export async function getAllSizeStock(): Promise<Map<string, StockOption[]>> {
  const supabase = getSupabase();
  const map = new Map<string, StockOption[]>();
  if (!supabase) return map;

  const { data, error } = await supabase
    .from("product_sizes")
    .select("product_id, quantity, sizes(id, name)")
    .returns<AllSizeStockRow[]>();

  if (error || !data) return map;
  for (const row of data) {
    if (!row.sizes) continue;
    const list = map.get(row.product_id) ?? [];
    list.push({ id: row.sizes.id, name: row.sizes.name, quantity: row.quantity });
    map.set(row.product_id, list);
  }
  return map;
}
