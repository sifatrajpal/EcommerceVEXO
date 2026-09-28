"use server";

import { getSupabase } from "@/lib/supabase/server";

export type SubscribeState = { status: "idle" | "success" | "error"; message?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) return { status: "error", message: "Enter a valid email address." };

  const supabase = getSupabase();
  if (!supabase) return { status: "error", message: "Newsletter isn't connected yet." };

  const { error } = await supabase.from("subscribers").insert({ email });
  // 23505 = unique violation → already subscribed, treat as success.
  if (error && error.code !== "23505") {
    console.error("[subscribe]", error.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
  return { status: "success", message: "You're in. Welcome to the club." };
}
