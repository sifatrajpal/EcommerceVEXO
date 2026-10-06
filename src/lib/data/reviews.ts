import "server-only";
import { getSupabase } from "@/lib/supabase/server";

export type Review = { id: string; name: string; rating: number; comment: string; createdAt: string };
export type RatingSummary = { average: number; count: number };

type ReviewRow = { id: string; name: string; rating: number; comment: string; created_at: string };

export async function getReviews(productId: string): Promise<Review[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, rating, comment, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .returns<ReviewRow[]>();

  if (error || !data) return [];
  return data.map((r) => ({ id: r.id, name: r.name, rating: r.rating, comment: r.comment, createdAt: r.created_at }));
}

export async function getRatingSummary(productId: string): Promise<RatingSummary> {
  const supabase = getSupabase();
  if (!supabase) return { average: 0, count: 0 };

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .returns<{ rating: number }[]>();

  if (error || !data || data.length === 0) return { average: 0, count: 0 };
  const total = data.reduce((sum, r) => sum + r.rating, 0);
  return { average: total / data.length, count: data.length };
}
