"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RefreshIcon } from "@/components/atoms/Icons";

export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [spun, setSpun] = useState(false);

  const handleClick = () => {
    setSpun(true);
    startTransition(() => router.refresh());
    setTimeout(() => setSpun(false), 600);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-2 rounded-lg border border-[#e4e5e8] bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-panel disabled:opacity-60"
    >
      <RefreshIcon className={`size-4 ${spun ? "animate-spin" : ""}`} />
      Refresh
    </button>
  );
}
