"use server";

import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

export type ContactState = { status: "idle" | "success" | "error"; message?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { status: "error", message: "Enter your name." };
  if (!EMAIL.test(email)) return { status: "error", message: "Enter a valid email address." };
  if (!subject) return { status: "error", message: "Enter a subject." };
  if (!message) return { status: "error", message: "Enter a message." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, subject, message });

  if (error) {
    console.error("[submitContactMessage]", error.message);
    return { status: "error", message: "Couldn't send that — try again in a moment." };
  }

  return { status: "success", message: "Thanks — we'll get back to you within 1–2 business days." };
}
