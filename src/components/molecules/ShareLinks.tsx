"use client";

import { useState } from "react";
import { FacebookIcon, XIcon, LinkIcon } from "@/components/atoms/Icons";
import { cn } from "@/lib/utils";

const iconBtn = "grid size-9 place-items-center rounded-full border border-[#e4e5e8] text-ink hover:bg-panel";

/** Real share links (Facebook/X open a share dialog; copy-link copies the current page URL). */
export function ShareLinks({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permission denied — nothing we can recover from here.
    }
  };

  const url = typeof window === "undefined" ? "" : window.location.href;

  return (
    <div className="flex items-center gap-[0.7cqw]">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={iconBtn}
      >
        <FacebookIcon className="size-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={iconBtn}
      >
        <XIcon className="size-3.5" />
      </a>
      <button type="button" onClick={share} aria-label="Copy link" className={cn(iconBtn, "relative")}>
        <LinkIcon className="size-4" />
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-ink px-2 py-1 text-[10px] whitespace-nowrap text-white">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
