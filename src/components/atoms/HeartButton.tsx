"use client";

import { useState } from "react";
import { HeartIcon } from "./Icons";
import { cn } from "@/lib/utils";

export function HeartButton({ label, className }: { label: string; className?: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      aria-label={saved ? `Remove ${label} from wishlist` : `Save ${label} to wishlist`}
      aria-pressed={saved}
      onClick={() => setSaved((s) => !s)}
      className={cn("grid size-[2cqw] min-h-6 min-w-6 place-items-center rounded-full bg-white transition-transform active:scale-90", className)}
    >
      <HeartIcon filled={saved} className="w-[60%]" />
    </button>
  );
}
