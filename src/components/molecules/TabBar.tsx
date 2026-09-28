"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type Props = { tabs: { id: string; label: string }[]; active: number; onChange: (index: number) => void; label: string };

/** Accessible tab list: click, or use ←/→ keys to move between tabs. */
export function TabBar({ tabs, active, onChange, label }: Props) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    onChange(next);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex flex-wrap items-center justify-between gap-[0.6cqw]">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          ref={(el) => { refs.current[i] = el; }}
          role="tab"
          type="button"
          aria-selected={i === active}
          tabIndex={i === active ? 0 : -1}
          onClick={() => onChange(i)}
          className={cn(
            "rounded-[0.7cqw] px-[2.2cqw] py-[0.8cqw] text-[clamp(10px,0.92cqw,14px)] transition-colors duration-300",
            i === active ? "bg-[#141414] text-white" : "text-[#333] hover:bg-[#dde0e3]",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
