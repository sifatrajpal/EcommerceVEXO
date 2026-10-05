import "server-only";
import { getSupabase } from "@/lib/supabase/server";
import { fallbackProducts, fallbackTabs } from "@/lib/data/fallback";
import type { EditTab, Product, ProductCategory } from "@/lib/types";

type ProductRow = {
  id: string;
  name: string;
  price: number | string;
  currency: string;
  season: string;
  category: string;
  collection: string | null;
  brand: string | null;
  material: string | null;
  image_url: string;
  is_new_arrival: boolean;
  created_at: string;
};
type TabRow = { id: string; label: string; image_a: string; image_b: string };

const PRODUCT_COLUMNS = "id, name, price, currency, season, category, collection, brand, material, image_url, is_new_arrival, created_at";

function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    price: Number(r.price),
    currency: r.currency,
    season: r.season,
    category: r.category as ProductCategory,
    collection: r.collection,
    brand: r.brand,
    material: r.material,
    imageUrl: r.image_url,
    isNewArrival: r.is_new_arrival,
    createdAt: r.created_at,
  };
}

export async function getNewArrivals(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackProducts;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_new_arrival", true)
    .order("sort", { ascending: true })
    .limit(8)
    .returns<ProductRow[]>();

  if (error || !data?.length) {
    if (error) console.error("[getNewArrivals]", error.message);
    return fallbackProducts;
  }
  return data.map(toProduct);
}

export type ProductSort = "newest" | "price-asc" | "price-desc";

export type ProductFilters = { category?: ProductCategory; season?: string; sort?: ProductSort };

function applyFallbackFilters(products: Product[], { category, season, sort }: ProductFilters): Product[] {
  let list = products;
  if (category) list = list.filter((p) => p.category === category);
  if (season) list = list.filter((p) => p.season.toLowerCase() === season.toLowerCase());
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

/** Full catalog for the /shop listing, optionally filtered by category/season and sorted. */
export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const { category, season, sort } = filters;
  const supabase = getSupabase();
  if (!supabase) return applyFallbackFilters(fallbackProducts, filters);

  let query = supabase.from("products").select(PRODUCT_COLUMNS);
  if (category) query = query.eq("category", category);
  if (season) query = query.ilike("season", season);

  if (sort === "price-asc") query = query.order("price", { ascending: true });
  else if (sort === "price-desc") query = query.order("price", { ascending: false });
  else query = query.order("sort", { ascending: true });

  const { data, error } = await query.returns<ProductRow[]>();
  if (error || !data) {
    if (error) console.error("[getProducts]", error.message);
    return applyFallbackFilters(fallbackProducts, filters);
  }
  return data.map(toProduct);
}

export async function getEditTabs(): Promise<EditTab[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackTabs;

  const { data, error } = await supabase
    .from("edit_tabs")
    .select("id, label, image_a, image_b")
    .order("sort", { ascending: true })
    .returns<TabRow[]>();

  if (error || !data?.length) {
    if (error) console.error("[getEditTabs]", error.message);
    return fallbackTabs;
  }
  return data.map((r) => ({ id: r.id, label: r.label, imageA: r.image_a, imageB: r.image_b }));
}

export async function getProductCount(): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return fallbackProducts.length;

  const { count, error } = await supabase.from("products").select("id", { count: "exact", head: true });
  if (error || count === null) return fallbackProducts.length;
  return count;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabase();
  if (!supabase) return fallbackProducts.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .maybeSingle<ProductRow>();

  if (error || !data) return fallbackProducts.find((p) => p.id === id) ?? null;
  return toProduct(data);
}
