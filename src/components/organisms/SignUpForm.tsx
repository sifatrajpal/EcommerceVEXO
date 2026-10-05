"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signUp, type AuthState } from "@/actions/auth";
import { GoogleIcon, AppleIcon, XIcon } from "@/components/atoms/Icons";
import { cn } from "@/lib/utils";

const initial: AuthState = { status: "idle" };

const inputClasses =
  "w-full rounded-lg border border-[#d8dade] bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-ink";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initial);

  return (
    <div className="grid gap-2.5 md:grid-cols-[2fr_3fr]">
      <div className="flex flex-col gap-10 py-6 md:justify-center">
        <div className="mx-auto flex w-full max-w-[360px] flex-col px-4">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-[#6b7078]">Gear up for every season and rep.</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button type="button" aria-label="Continue with Google" className="grid place-items-center rounded-lg border border-[#d8dade] py-2.5 hover:bg-[#f6f6f4]">
              <GoogleIcon className="size-[18px]" />
            </button>
            <button type="button" aria-label="Continue with Apple" className="grid place-items-center rounded-lg border border-[#d8dade] py-2.5 hover:bg-[#f6f6f4]">
              <AppleIcon className="size-[18px]" />
            </button>
            <button type="button" aria-label="Continue with X" className="grid place-items-center rounded-lg border border-[#d8dade] py-2.5 hover:bg-[#f6f6f4]">
              <XIcon className="size-[16px]" />
            </button>
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
              <input type="password" name="password" required autoComplete="new-password" placeholder="At least 8 characters" className={inputClasses} />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
              Confirm password
              <input type="password" name="confirmPassword" required autoComplete="new-password" placeholder="••••••••" className={inputClasses} />
            </label>

            <p aria-live="polite" className={cn("min-h-5 text-[13px]", state.status === "error" ? "text-[#c23434]" : "text-[#6b7078]")}>
              {state.message}
            </p>

            <button type="submit" disabled={pending} className="rounded-lg bg-[#141414] py-2.5 text-[14px] font-medium text-white disabled:opacity-60">
              {pending ? "Creating…" : "Sign Up"}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-[#6b7078]">
          Already have an account? <Link href="/sign-in" className="font-semibold text-ink">Sign in</Link>
        </p>
      </div>

      <div className="relative hidden overflow-hidden rounded-[22px] md:block">
        <Image src="/images/poster-group.png" alt="Model in a beige trench coat and jeans" fill sizes="60vw" className="object-cover object-[50%_22%]" priority />
      </div>
    </div>
  );
}
