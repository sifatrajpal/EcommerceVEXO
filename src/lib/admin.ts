import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

/** True only for a signed-in user with a row in public.admins (added manually in Supabase). */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return !!data;
}
