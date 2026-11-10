import Link from "next/link";
import { Panel } from "@/components/atoms/Panel";
import { Button } from "@/components/atoms/Button";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { RevealImage } from "@/components/atoms/RevealImage";
import { BoxIcon, PlayIcon } from "@/components/atoms/Icons";
import { SiteHeader } from "./SiteHeader";
import { THEME_IMAGES } from "@/lib/theme-images";

const COPY = {
  eyebrow: "EFFORTLESS. MODERN. YOU.",
  heading: ["Style That", "Moves With", "You."],
  body: "Timeless pieces, thoughtfully designed for every moment of your day.",
  shop: "SHOP COLLECTIONS",
  explore: "EXPLORE NEW IN",
  ribbon: "FREE SHIPPING ON ORDERS $150+",
  discover: "DISCOVER THE STORY",
};

/**
 * Studio-only hero: a split layout (serif copy on the left, a half-width photo on the
 * right) with a vertical shipping "side-tab" ribbon, standing in for every other
 * theme's centered trapezoid-notch hero.
 */
export function HeroStudio() {
  const images = THEME_IMAGES.studio;

  return (
    <Panel background="bg-frame" className="aspect-[921/560] min-h-[560px]">
      <div className="absolute inset-y-0 right-0 z-0 w-[55%] max-md:w-full max-md:opacity-90">
        <RevealImage
          src={images.hero}
          alt="Model from the current collection"
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className="absolute inset-0"
          imgClassName="object-top"
        />
      </div>

      <SiteHeader />

      <aside className="absolute top-[40%] left-[2.6cqw] z-30 flex w-[4.2cqw] min-w-13 flex-col items-center gap-[1.1cqw] rounded-[0.3cqw] bg-[var(--color-accent)] py-[1.3cqw] text-white shadow-lg animate-from-left [animation-delay:1.6s] max-md:top-auto max-md:bottom-[4cqw]">
        <BoxIcon className="size-[1.5cqw] min-h-4 min-w-4 rotate-90" />
        <span className="text-center text-[clamp(7px,0.6cqw,9px)] leading-[1.3] tracking-[0.02em] [writing-mode:vertical-rl] rotate-180">
          {COPY.ribbon}
        </span>
      </aside>

      <div className="relative z-20 max-w-[46%] px-[7.6cqw] pt-[5.4cqw] pb-[6cqw] max-md:max-w-[88%] max-md:px-[4.6cqw] max-md:pt-[3cqw]">
        <p className="mb-[1.1cqw] animate-up text-[clamp(10px,0.78cqw,12px)] tracking-[0.08em] text-muted [animation-delay:1.6s]">
          {COPY.eyebrow}
        </p>
        <AnimatedHeading
          as="h1"
          lines={COPY.heading}
          baseDelay={1.8}
          className="text-[clamp(30px,4.1cqw,56px)] leading-[1.06] font-medium tracking-[-0.01em]"
        />
        <p className="mt-[1.8cqw] max-w-[88%] animate-up text-[clamp(11px,0.9cqw,14px)] leading-[1.55] text-muted [animation-delay:2.4s]">
          {COPY.body}
        </p>
        <div className="mt-[2.4cqw] flex animate-up items-center gap-[1.8cqw] [animation-delay:2.7s]">
          <Button href="/shop" className="!bg-[var(--color-accent)]">{COPY.shop}</Button>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-[0.5cqw] text-[clamp(9px,0.8cqw,13px)] font-medium tracking-[0.02em] underline underline-offset-4"
          >
            {COPY.explore}
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <Link
        href="/shop"
        aria-label="Discover the story"
        className="absolute right-[6.2cqw] bottom-[4cqw] z-20 flex animate-from-right items-center gap-[0.9cqw] [animation-delay:3s] max-md:right-[4cqw] max-md:bottom-[2.4cqw]"
      >
        <span className="grid size-[3.6cqw] min-h-10 min-w-10 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_80%,black)] text-white">
          <PlayIcon className="ml-[8%] w-[30%]" />
        </span>
        <span className="max-w-[6cqw] text-[clamp(9px,0.78cqw,12px)] leading-[1.3] font-medium">{COPY.discover}</span>
      </Link>
    </Panel>
  );
}
