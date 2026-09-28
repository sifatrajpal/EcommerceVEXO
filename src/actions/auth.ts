"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

export type AuthState = { status: "idle" | "error"; message?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!EMAIL.test(email)) return { status: "error", message: "Enter a valid email address." };
  if (!password) return { status: "error", message: "Enter your password." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", message: error.message };

  redirect("/");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  if (!EMAIL.test(email)) return { status: "error", message: "Enter a valid email address." };
  if (password.length < 8) return { status: "error", message: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { status: "error", message: "Passwords don't match." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { status: "error", message: error.message };

  // A session means email confirmation is off (or not required) — you're in immediately.
  if (data.session) redirect("/");

  return { status: "error", message: "Check your email to confirm your account, then sign in." };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
