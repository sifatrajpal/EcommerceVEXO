"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
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
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!name) return { status: "error", message: "Enter your name." };
  if (!EMAIL.test(email)) return { status: "error", message: "Enter a valid email address." };
  if (password.length < 8) return { status: "error", message: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { status: "error", message: "Passwords don't match." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, phone: phone || null } },
  });
  if (error) return { status: "error", message: error.message };

  // A session means email confirmation is off (or not required) — you're in immediately.
  if (data.session) redirect("/");

  return { status: "error", message: "Check your email to confirm your account, then sign in." };
}

const OAUTH_PROVIDERS = ["google", "facebook"] as const;
type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

/** Redirects the browser to the provider's consent screen; Supabase must have that provider enabled first. */
export async function signInWithOAuth(formData: FormData) {
  const provider = String(formData.get("provider") ?? "");
  if (!OAUTH_PROVIDERS.includes(provider as OAuthProvider)) redirect("/sign-in");

  const supabase = await createSupabaseServerClient();
  const origin = (await headers()).get("origin") ?? "";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as OAuthProvider,
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) {
    console.error("[signInWithOAuth]", error?.message ?? "no redirect URL returned");
    redirect("/sign-in?error=oauth-failed");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

/** Emails a password-reset link. Always returns the same message, whether or not the email exists, so we don't leak which emails have accounts. */
export async function requestPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) return { status: "error", message: "Enter a valid email address." };

  const supabase = await createSupabaseServerClient();
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password&type=recovery`,
  });
  if (error) console.error("[requestPasswordReset]", error.message);

  return { status: "idle", message: "If an account exists for that email, a reset link is on its way." };
}

/** Sets a new password for the recovery session created by clicking the emailed reset link. */
export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  if (password.length < 8) return { status: "error", message: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { status: "error", message: "Passwords don't match." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { status: "error", message: error.message };

  redirect("/sign-in?reset=success");
}
