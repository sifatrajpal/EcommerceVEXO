import "server-only";
import { cache } from "react";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/auth-server";

/**
 * True only for a signed-in user with a row in public.admins (added manually in Supabase).
 * Cached per request — SiteHeader and the admin layout both call this on the same render.
 */
export const isCurrentUserAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return !!data;
});
