"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCoupon, type CreateCouponState } from "@/actions/admin-coupons";

const initial: CreateCouponState = { status: "idle" };

const inputClasses = "w-full rounded-md border border-[#d8dade] bg-white px-3 py-2 text-[14px] outline-none focus:border-ink";
const labelClasses = "flex flex-col gap-1.5 text-[13px] font-medium";

export function AdminCouponForm() {
  const [state, formAction, pending] = useActionState(createCoupon, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 md:grid-cols-4">
      <label className={labelClasses}>
        Code
        <input name="code" required placeholder="SUMMER20" className={`${inputClasses} uppercase`} />
      </label>

      <label className={labelClasses}>
        Discount type
        <select name="discountType" defaultValue="percent" className={inputClasses}>
          <option value="percent">Percent off</option>
          <option value="flat">Flat amount off</option>
        </select>
      </label>

      <label className={labelClasses}>
        Discount value
        <input name="discountValue" type="number" step="0.01" min="0" required placeholder="20" className={inputClasses} />
      </label>

      <label className={labelClasses}>
        Expires (optional)
        <input name="expiresAt" type="date" className={inputClasses} />
      </label>

      <div className="md:col-span-4">
        {state.status !== "idle" && (
          <p className={`mb-2 text-[13px] ${state.status === "error" ? "text-[#c23434]" : "text-[#3aa15c]"}`}>{state.message}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#141414] px-5 py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}
