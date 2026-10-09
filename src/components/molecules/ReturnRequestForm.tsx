"use client";

import { useActionState } from "react";
import { requestReturn, type ReturnState } from "@/actions/returns";

const initial: ReturnState = { status: "idle" };

export function ReturnRequestForm({ orderId }: { orderId: string }) {
  const [state, formAction, pending] = useActionState(requestReturn, initial);

  if (state.status === "success") {
    return <p className="mt-[1.2cqw] text-[clamp(12px,0.9cqw,14px)] font-medium text-[#3aa15c]">{state.message}</p>;
  }

  return (
    <form action={formAction} className="mt-[1.2cqw] flex flex-col gap-[0.8cqw]">
      <input type="hidden" name="orderId" value={orderId} />
      <textarea
        name="reason"
        required
        rows={3}
        placeholder="Why are you returning this order?"
        className="w-full rounded-[0.8cqw] border border-[#d8dade] bg-white px-[1cqw] py-[0.8cqw] text-[clamp(12px,0.9cqw,14px)] outline-none focus:border-ink"
      />
      {state.status === "error" && <p className="text-[clamp(11px,0.85cqw,13px)] text-[#c23434]">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-[#141414] px-[1.4cqw] py-[0.7cqw] text-[clamp(12px,0.9cqw,14px)] font-medium text-white disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit return request"}
      </button>
    </form>
  );
}
