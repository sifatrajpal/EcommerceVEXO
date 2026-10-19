"use client";

import { useActionState } from "react";
import { setTheme, type SetThemeState } from "@/actions/admin-settings";
import type { Theme } from "@/lib/data/settings";

const initial: SetThemeState = { status: "idle" };

const OPTIONS: { value: Theme; name: string; blurb: string; swatches: string[] }[] = [
  {
    value: "default",
    name: "Default — VEXO",
    blurb: "The original storefront. Always safe to come back to.",
    swatches: ["#111111", "#ffffff", "#e9ebed"],
  },
  {
    value: "elanora",
    name: "Élanora",
    blurb: "Warm cream palette, serif headings, flat sections and swapped section order/layout — adapted from the design the manager sent over.",
    swatches: ["#2a2420", "#f8f5f1", "#ede6dd"],
  },
  {
    value: "noir",
    name: "Noir",
    blurb: "Dark, flat and bold — condensed uppercase headings and moodier photography for a streetwear/techwear read.",
    swatches: ["#f2f2f0", "#0c0c0d", "#1c1c1f"],
  },
  {
    value: "studio",
    name: "Studio",
    blurb: "Soft, airy and minimal — extra-rounded corners, a serif display face and editorial studio photography.",
    swatches: ["#2b2824", "#faf8f5", "#f1ece4"],
  },
];

export function AdminThemeForm({ active }: { active: Theme }) {
  const [state, formAction, pending] = useActionState(setTheme, initial);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <form key={opt.value} action={formAction}>
            <input type="hidden" name="theme" value={opt.value} />
            <button
              type="submit"
              disabled={pending}
              className={`flex w-full flex-col gap-3 rounded-[14px] border-2 p-5 text-left transition-colors disabled:cursor-not-allowed ${
                active === opt.value ? "border-[#141414]" : "border-[#eceef0] hover:border-[#d8dade]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold">{opt.name}</span>
                {active === opt.value && (
                  <span className="rounded-full bg-[#141414] px-2.5 py-1 text-[11px] font-medium text-white">Active</span>
                )}
              </div>
              <div className="flex gap-1.5">
                {opt.swatches.map((c) => (
                  <span key={c} className="size-6 rounded-full border border-black/10" style={{ background: c }} />
                ))}
              </div>
              <p className="text-[13px] text-[#8e939a]">{opt.blurb}</p>
            </button>
          </form>
        ))}
      </div>

      {state.status !== "idle" && (
        <p className={`text-[13px] ${state.status === "error" ? "text-[#c23434]" : "text-[#3aa15c]"}`}>{state.message}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-[#eceef0] pt-4">
        <form action={formAction}>
          <input type="hidden" name="theme" value="default" />
          <button
            type="submit"
            disabled={pending || active === "default"}
            className="rounded-lg border border-[#d8dade] px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-panel disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset to original theme
          </button>
        </form>
        <p className="text-[12px] text-[#8e939a]">Instantly reverts every page back to the Default look — no files are touched.</p>
      </div>
    </div>
  );
}
