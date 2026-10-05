import "server-only";
import { getSupabase } from "@/lib/supabase/server";

export type MetaItem = { id: string; name: string; hex?: string };

async function fetchMeta(table: string, withHex = false): Promise<MetaItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const columns = withHex ? "id, name, hex" : "id, name";
  const { data, error } = await supabase.from(table).select(columns).order("sort", { ascending: true }).returns<MetaItem[]>();
  if (error || !data) return [];
  return data;
}

export const getCategories = () => fetchMeta("categories");
export const getBrands = () => fetchMeta("brands");
export const getCollections = () => fetchMeta("collections");
export const getSizes = () => fetchMeta("sizes");
export const getColors = () => fetchMeta("colors", true);
export const getMaterials = () => fetchMeta("materials");
