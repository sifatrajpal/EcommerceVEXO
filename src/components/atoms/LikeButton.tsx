"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { HeartIcon } from "./Icons";
import { getLikeState, toggleLike } from "@/actions/likes";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "vexo_liker_key";

/** A random per-browser id standing in for "who liked this" — no account needed. */
function getLikerKey() {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(STORAGE_KEY);
  if (!key) {
    key = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}

type Props = { productId: string; label: string; className?: string; showCount?: boolean };

export function LikeButton({ productId, label, className, showCount = false }: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    getLikeState(productId, getLikerKey()).then((s) => {
      if (active) {
        setLiked(s.liked);
        setCount(s.count);
      }
    });
    return () => {
      active = false;
    };
  }, [productId]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (pending) return;
      setPending(true);
      const wasLiked = liked;
      setLiked(!wasLiked);
      setCount((prev) => (prev === null ? prev : prev + (wasLiked ? -1 : 1)));
      toggleLike(productId, getLikerKey())
        .then((s) => {
          setLiked(s.liked);
          setCount(s.count);
        })
        .finally(() => setPending(false));
    },
    [productId, liked, pending],
  );

  const button = (
    <button
      type="button"
      aria-label={liked ? `Unlike ${label}` : `Like ${label}`}
      aria-pressed={liked}
      onClick={handleClick}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full border border-[#e4e5e8] bg-white transition-transform active:scale-90",
        !showCount && className,
      )}
    >
      <HeartIcon filled={liked} className="w-[55%]" />
    </button>
  );

  if (!showCount) return button;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {button}
      <span className="text-[13px] font-medium text-[#6b7078]">{count ?? "–"} likes</span>
    </span>
  );
}
