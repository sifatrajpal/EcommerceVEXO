import "server-only";
import { getSupabase } from "@/lib/supabase/server";

/** One (size, color) combination that's actually stocked for a product. */
export type Variant = { sizeId: string; sizeName: string; colorId: string; colorName: string; hex: string; quantity: number };

type VariantRow = {
  quantity: number;
  sizes: { id: string; name: string } | null;
  colors: { id: string; name: string; hex: string } | null;
};

export async function getProductVariants(productId: string): Promise<Variant[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("product_variants")
    .select("quantity, sizes(id, name), colors(id, name, hex)")
    .eq("product_id", productId)
    .returns<VariantRow[]>();

  if (error || !data) return [];
  return data
    .filter((r) => r.sizes && r.colors)
    .map((r) => ({
      sizeId: r.sizes!.id,
      sizeName: r.sizes!.name,
      colorId: r.colors!.id,
      colorName: r.colors!.name,
      hex: r.colors!.hex,
      quantity: r.quantity,
    }));
}

type AllVariantRow = VariantRow & { product_id: string };

/** Bulk-fetches every product's size→color variants in one query, for the admin products list. */
export async function getAllVariants(): Promise<Map<string, Variant[]>> {
  const supabase = getSupabase();
  const map = new Map<string, Variant[]>();
  if (!supabase) return map;

  const { data, error } = await supabase
    .from("product_variants")
    .select("product_id, quantity, sizes(id, name), colors(id, name, hex)")
    .returns<AllVariantRow[]>();

  if (error || !data) return map;
  for (const row of data) {
    if (!row.sizes || !row.colors) continue;
    const list = map.get(row.product_id) ?? [];
    list.push({
      sizeId: row.sizes.id,
      sizeName: row.sizes.name,
      colorId: row.colors.id,
      colorName: row.colors.name,
      hex: row.colors.hex,
      quantity: row.quantity,
    });
    map.set(row.product_id, list);
  }
  return map;
}
