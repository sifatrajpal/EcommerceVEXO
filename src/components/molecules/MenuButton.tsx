"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/molecules/NavLinks";

/** Round animated hamburger ↔ close button that reveals a dropdown of nav links. */
export function MenuButton({ items, className }: { items: NavItem[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="grid size-[3.1cqw] min-h-7 min-w-7 place-items-center rounded-full bg-[#141414]"
      >
        <span className="relative block h-[0.9em] w-[1.1em]">
          <span
            className={cn(
              "absolute inset-x-0 top-0 h-[1.5px] origin-center rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
              open && "translate-y-[0.45em] rotate-45"
            )}
          />
          <span
            className={cn(
              "absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-white transition-opacity duration-200",
              open && "opacity-0"
            )}
          />
          <span
            className={cn(
              "absolute inset-x-0 bottom-0 h-[1.5px] origin-center rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
              open && "-translate-y-[0.45em] -rotate-45"
            )}
          />
        </span>
      </button>

      <nav
        aria-label="Main"
        className={cn(
          "absolute top-[calc(100%+0.8cqw)] left-0 z-50 min-w-[9.5cqw] origin-top-left rounded-[1.2cqw] bg-[#141414] p-[0.6cqw] text-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-all duration-250 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        )}
      >
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-[0.7cqw] px-[1cqw] py-[0.7cqw] text-[clamp(11px,0.95cqw,15px)] tracking-[0.02em] hover:bg-white/10"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
