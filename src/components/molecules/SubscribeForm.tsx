"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/actions/subscribe";
import { cn } from "@/lib/utils";

const initial: SubscribeState = { status: "idle" };

/**
 * Pipeline: form submit → server action `subscribe` (runs on the server)
 * → inserts into Supabase `subscribers` → returns a state → UI shows the message.
 */
export function SubscribeForm() {
  const [state, action, pending] = useActionState(subscribe, initial);

  return (
    <div className="mt-[2.2cqw]">
      <form action={action} className="flex max-w-[30cqw] min-w-[260px] rounded-full border border-[#3a3a3a] p-[0.35cqw] focus-within:border-[#e9ebed]">
        <input
          type="email"
          name="email"
          required
          placeholder="Your email address"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent px-[1.2cqw] text-[clamp(11px,0.9cqw,14px)] text-white outline-none placeholder:text-[#777]"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#e9ebed] px-[1.8cqw] py-[1cqw] text-[clamp(9px,0.85cqw,13px)] text-ink disabled:opacity-60"
        >
          {pending ? "…" : state.status === "success" ? "SUBSCRIBED" : "SUBSCRIBE"}
        </button>
      </form>
      <p aria-live="polite" className={cn("mt-2 min-h-5 text-[clamp(10px,0.8cqw,13px)]", state.status === "error" ? "text-[#ff8a8a]" : "text-[#9a9ea5]")}>
        {state.message}
      </p>
    </div>
  );
}
