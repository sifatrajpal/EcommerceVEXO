"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signInWithOAuth, type AuthState } from "@/actions/auth";
import { GoogleIcon, FacebookIcon } from "@/components/atoms/Icons";
import { cn } from "@/lib/utils";

const initial: AuthState = { status: "idle" };

const inputClasses =
  "w-full rounded-lg border border-[#d8dade] bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-ink";

const oauthButtonClasses =
  "flex items-center justify-center gap-2 rounded-lg border border-[#d8dade] py-2.5 text-[14px] font-medium hover:bg-[#f6f6f4]";

export function SignInForm({ banner, errorBanner }: { banner?: string; errorBanner?: string }) {
  const [state, formAction, pending] = useActionState(signIn, initial);

  return (
    <div className="grid gap-2.5 md:grid-cols-[2fr_3fr]">
      <div className="flex flex-col gap-10 py-6 md:justify-center">
        <div className="mx-auto flex w-full max-w-[360px] flex-col px-4">
          <h1 className="text-2xl font-semibold">Sign into your account</h1>
          <p className="mt-1 text-sm text-[#6b7078]">Performance wear for every season and rep.</p>
          {banner && <p className="mt-3 text-[13px] text-[#3aa15c]">{banner}</p>}
          {errorBanner && <p className="mt-3 text-[13px] text-[#c23434]">{errorBanner}</p>}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <form action={signInWithOAuth}>
              <input type="hidden" name="provider" value="google" />
              <button type="submit" className={oauthButtonClasses}>
                <GoogleIcon className="size-[18px]" />
                Google
              </button>
            </form>
            <form action={signInWithOAuth}>
              <input type="hidden" name="provider" value="facebook" />
              <button type="submit" className={oauthButtonClasses}>
                <FacebookIcon className="size-[18px]" />
                Facebook
              </button>
            </form>
          </div>

          <div className="my-6 flex items-center gap-3 text-[13px] text-[#8e939a]">
            <span className="h-px flex-1 bg-[#e4e5e8]" /> or <span className="h-px flex-1 bg-[#e4e5e8]" />
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
              Email
              <input type="email" name="email" required autoComplete="email" placeholder="Enter your email" className={inputClasses} />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
              Password
              <input type="password" name="password" required autoComplete="current-password" placeholder="••••••••" className={inputClasses} />
              <Link href="/forgot-password" className="mt-1 w-fit text-[13px] font-normal text-[#6b7078] hover:text-ink">Forgot password?</Link>
            </label>

            <p aria-live="polite" className={cn("min-h-5 text-[13px]", state.status === "error" ? "text-[#c23434]" : "text-[#6b7078]")}>
              {state.message}
            </p>

            <button type="submit" disabled={pending} className="rounded-lg bg-[#141414] py-2.5 text-[14px] font-medium text-white disabled:opacity-60">
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-[13px] text-[#6b7078]">
            Can&apos;t sign in? <Link href="/forgot-password" className="font-semibold text-ink">Reset password</Link>
          </p>
        </div>

        <p className="text-center text-[13px] text-[#6b7078]">
          Don&apos;t have an account? <Link href="/sign-up" className="font-semibold text-ink">Sign up</Link>
        </p>
      </div>

      <div className="relative hidden overflow-hidden rounded-[22px] md:block">
        <Image src="/images/poster-group.png" alt="Model in a beige trench coat and jeans" fill sizes="60vw" className="object-cover object-[50%_22%]" priority />
      </div>
    </div>
  );
}
