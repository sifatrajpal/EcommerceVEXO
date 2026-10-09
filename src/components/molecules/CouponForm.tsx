"use client";

import { useActionState } from "react";
import { applyCoupon, type CouponState } from "@/actions/coupons";
import { ArrowUpRightIcon } from "@/components/atoms/Icons";

const initial: CouponState = { status: "idle" };

export function CouponForm() {
  const [state, formAction, pending] = useActionState(applyCoupon, initial);

  return (
    <form action={formAction}>
      <input
        name="code"
        placeholder="Enter Coupon Code"
        className="w-full rounded-md border border-[#d8dade] bg-white px-3 py-2 text-[13px] outline-none focus:border-ink"
      />
      {state.status !== "idle" && (
        <p className={`mt-1.5 text-[12px] ${state.status === "error" ? "text-[#c23434]" : "text-[#3aa15c]"}`}>{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex w-full items-center justify-between rounded-md bg-[#141414] px-3 py-2 text-[13px] font-medium text-white disabled:opacity-60"
      >
        {pending ? "Applying…" : "Apply Coupon"}
        <ArrowUpRightIcon className="size-3.5" />
      </button>
    </form>
  );
}
