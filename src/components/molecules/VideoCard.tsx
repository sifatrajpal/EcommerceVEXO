"use client";

import Image from "next/image";
import { PlayIcon } from "@/components/atoms/Icons";

/** Video preview with a pulsing play button (hero, bottom-right). */
export function VideoCard({ thumbnail, onPlay }: { thumbnail: string; onPlay?: () => void }) {
  return (
    <div className="absolute right-[2.9cqw] bottom-[6cqw] z-20 grid aspect-[178/115] w-[19.4cqw] animate-from-right place-items-center overflow-hidden rounded-[1.1cqw] [animation-delay:3s]">
      <Image src={thumbnail} alt="Sneaker video preview" fill sizes="20vw" className="object-cover" />
      <button
        type="button"
        aria-label="Play video"
        onClick={onPlay}
        className="relative grid size-[4.4cqw] min-h-8 min-w-8 place-items-center rounded-full bg-[#1a1a1a]/80 text-white after:absolute after:inset-0 after:animate-ping-soft after:rounded-full after:border after:border-white"
      >
        <PlayIcon className="ml-[8%] w-[32%]" />
      </button>
    </div>
  );
}
