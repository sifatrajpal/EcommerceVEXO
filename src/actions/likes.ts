"use server";

import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

export type LikeState = { liked: boolean; count: number };

async function countLikes(productId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("product_likes")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);
  return count ?? 0;
}

/** Reads whether `likerKey` (a random id the browser keeps in localStorage) has liked this product, plus the total count. */
export async function getLikeState(productId: string, likerKey: string): Promise<LikeState> {
  const supabase = await createSupabaseServerClient();
  const [{ data: own }, count] = await Promise.all([
    supabase.from("product_likes").select("id").eq("product_id", productId).eq("liker_key", likerKey).maybeSingle(),
    countLikes(productId),
  ]);
  return { liked: !!own, count };
}

/** Toggles a like for `likerKey` on this product — no sign-in required. */
export async function toggleLike(productId: string, likerKey: string): Promise<LikeState> {
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("product_likes")
    .select("id")
    .eq("product_id", productId)
    .eq("liker_key", likerKey)
    .maybeSingle();

  if (existing) {
    await supabase.from("product_likes").delete().eq("id", existing.id);
  } else {
    await supabase.from("product_likes").insert({ product_id: productId, liker_key: likerKey });
  }

  return { liked: !existing, count: await countLikes(productId) };
}
