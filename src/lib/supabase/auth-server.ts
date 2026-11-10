import "server-only";
import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Per-request, cookie-aware Supabase client for Server Components/Actions that need
 * the signed-in user (auth, not the anonymous catalog reads in `server.ts`).
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error(
      "[createSupabaseServerClient] Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY at runtime — check the deployment's environment variables.",
    );
    throw new Error("VEXO_CONFIG_ERROR: Supabase env vars are missing in this deployment.");
  }

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component render — middleware refreshes the session instead.
        }
      },
    },
  });
}

/**
 * The signed-in user, memoized for the lifetime of a single request (React `cache`).
 * `supabase.auth.getUser()` makes a real network call to Supabase Auth every time it's
 * invoked — SiteHeader, the cart/admin helpers, and several pages each used to call it
 * independently on one page load. Routing them all through this shared cache turns that
 * into a single call per request, no matter how many of them run.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
