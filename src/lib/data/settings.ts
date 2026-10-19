import "server-only";
import { getSupabase } from "@/lib/supabase/server";

export const THEMES = ["default", "elanora", "noir", "studio"] as const;
export type Theme = (typeof THEMES)[number];

/** Falls back to "default" (today's look) whenever Supabase, the row, the table, or the stored value is missing/invalid. */
export async function getActiveTheme(): Promise<Theme> {
  const supabase = getSupabase();
  if (!supabase) return "default";

  const { data } = await supabase.from("site_settings").select("value").eq("key", "theme").maybeSingle();
  const value = data?.value;
  return (THEMES as readonly string[]).includes(value ?? "") ? (value as Theme) : "default";
}
