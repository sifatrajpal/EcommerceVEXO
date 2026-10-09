"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthState } from "@/actions/auth";
import { cn } from "@/lib/utils";

const initial: AuthState = { status: "idle" };

const inputClasses =
  "w-full rounded-lg border border-[#d8dade] bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-ink";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initial);

  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col px-4">
      <h1 className="text-2xl font-semibold">Reset your password</h1>
      <p className="mt-1 text-sm text-[#6b7078]">Enter your email and we&apos;ll send you a reset link.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[13px] font-medium">
          Email
          <input type="email" name="email" required autoComplete="email" placeholder="Enter your email" className={inputClasses} />
        </label>

        <p aria-live="polite" className={cn("min-h-5 text-[13px]", state.status === "error" ? "text-[#c23434]" : "text-[#6b7078]")}>
          {state.message}
        </p>

        <button type="submit" disabled={pending} className="rounded-lg bg-[#141414] py-2.5 text-[14px] font-medium text-white disabled:opacity-60">
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-4 text-center text-[13px] text-[#6b7078]">
        <Link href="/sign-in" className="font-semibold text-ink">Back to sign in</Link>
      </p>
    </div>
  );
}
