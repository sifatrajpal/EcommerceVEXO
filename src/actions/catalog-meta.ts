"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { isCurrentUserAdmin } from "@/lib/admin";

const TABLES = ["categories", "brands", "collections", "sizes", "colors", "materials"] as const;
export type MetaTable = (typeof TABLES)[number];

function isMetaTable(t: string): t is MetaTable {
  return (TABLES as readonly string[]).includes(t);
}

export type MetaFormState = { status: "idle" | "success" | "error"; message?: string };

export async function createMetaItem(_prev: MetaFormState, formData: FormData): Promise<MetaFormState> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) return { status: "error", message: "Not authorized." };

  const table = String(formData.get("table") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!isMetaTable(table)) return { status: "error", message: "Unknown list." };
  if (!name) return { status: "error", message: "Enter a name." };

  const row: Record<string, string> = { name };
  if (table === "colors") {
    const hex = String(formData.get("hex") ?? "#141414").trim();
    row.hex = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#141414";
  }

  const { error } = await supabase.from(table).insert(row);
  if (error) {
    return { status: "error", message: error.code === "23505" ? "That already exists." : "Couldn't save that." };
  }

  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
  return { status: "success", message: `"${name}" added.` };
}

export async function deleteMetaItem(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) redirect("/admin");

  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!isMetaTable(table) || !id) return;

  await supabase.from(table).delete().eq("id", id);
  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
}
