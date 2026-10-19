"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { isCurrentUserAdmin } from "@/lib/admin";
import { THEMES, type Theme } from "@/lib/data/settings";

export type SetThemeState = { status: "idle" | "success" | "error"; message?: string };

export async function setTheme(_prev: SetThemeState, formData: FormData): Promise<SetThemeState> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) return { status: "error", message: "Not authorized." };

  const theme = String(formData.get("theme") ?? "");
  if (!THEMES.includes(theme as Theme)) return { status: "error", message: "Unknown theme." };

  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "theme", value: theme, updated_at: new Date().toISOString() });

  if (error) return { status: "error", message: "Couldn't save the theme. Has the site_settings table been created yet?" };

  revalidatePath("/", "layout");
  return { status: "success", message: theme === "default" ? "Reverted to the original theme." : "Theme switched." };
}
