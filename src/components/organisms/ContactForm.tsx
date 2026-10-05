"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactMessage, type ContactState } from "@/actions/contact";

const initial: ContactState = { status: "idle" };

const inputClasses = "w-full rounded-lg border border-[#d8dade] bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-ink";
const labelClasses = "flex flex-col gap-1.5 text-[13px] font-medium";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClasses}>
          Name
          <input name="name" required placeholder="Your name" className={inputClasses} />
        </label>
        <label className={labelClasses}>
          Email
          <input name="email" type="email" required placeholder="you@example.com" className={inputClasses} />
        </label>
      </div>

      <label className={labelClasses}>
        Subject
        <input name="subject" required placeholder="How can we help?" className={inputClasses} />
      </label>

      <label className={labelClasses}>
        Message
        <textarea name="message" required rows={5} placeholder="Tell us a bit more…" className={`${inputClasses} resize-none`} />
      </label>

      {state.status !== "idle" && (
        <p className={`text-[13px] ${state.status === "error" ? "text-[#c23434]" : "text-[#3aa15c]"}`}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-[#141414] py-3 text-[14px] font-medium text-white disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
