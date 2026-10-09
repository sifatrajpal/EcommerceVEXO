"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/actions/auth";
import { cn } from "@/lib/utils";

const initial: AuthState = { status: "idle" };

const inputClasses =
  "w-full rounded-lg border border-[#d8dade] bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-ink";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initial);

  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col px-4">
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <p className="mt-1 text-sm text-[#6b7078]">Choose a new password for your account.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[13px] font-medium">
          New password
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
          {pending ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
