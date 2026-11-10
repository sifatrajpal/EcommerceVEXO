import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/components/atoms/Panel";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { Text } from "@/components/atoms/Text";
import { THEME_IMAGES } from "@/lib/theme-images";

const images = THEME_IMAGES.studio;

/**
 * Studio-only: three promo cards (terracotta / neutral / sage, the last with a circular
 * discount badge) — a quieter, card-based promo language standing in for the default
 * theme's scrolling marquee posters.
 */
export function PromoCards() {
  return (
    <Panel className="grid gap-[1.6cqw] p-[1.6cqw] md:grid-cols-3">
      <article className="relative flex min-h-[15cqw] flex-col justify-between overflow-hidden rounded-[1.6cqw] bg-[var(--color-accent-warm)] p-[2.2cqw] text-white">
        <div className="relative z-10 max-w-[68%]">
          <AnimatedHeading
            onDark
            lines={["ACCESSORIES THAT", "COMPLETE THE LOOK"]}
            className="mb-[0.8cqw] text-[1.6cqw] leading-[1.15] font-medium"
          />
          <Text className="text-white/85">Elevate your style with our curated picks.</Text>
          <Link href="/shop" className="mt-[1.4cqw] inline-block border-b border-white/70 pb-0.5 text-[clamp(9px,0.78cqw,12px)] text-white">
            Shop accessories →
          </Link>
        </div>
        <div className="absolute inset-y-0 right-0 w-[42%]">
          <Image src={images.featureAthlete} alt="" fill sizes="20vw" className="object-cover object-top" />
        </div>
      </article>

      <article className="relative flex min-h-[15cqw] flex-col justify-between overflow-hidden rounded-[1.6cqw] bg-panel p-[2.2cqw]">
        <div className="relative z-10 max-w-[62%]">
          <AnimatedHeading lines={["EDITORIAL", "FASHION STORIES"]} className="mb-[0.8cqw] text-[1.6cqw] leading-[1.15] font-medium" />
          <Text>Inspiration, trends and timeless style advice.</Text>
          <Link href="/shop" className="mt-[1.4cqw] inline-block border-b border-ink pb-0.5 text-[clamp(9px,0.78cqw,12px)]">
            Read the journal →
          </Link>
        </div>
        <div className="absolute inset-y-0 right-0 w-[38%]">
          <Image src={images.posterGroup} alt="" fill sizes="18vw" className="object-cover object-top" />
        </div>
      </article>

      <article className="flex min-h-[15cqw] items-center justify-between gap-[1.4cqw] rounded-[1.6cqw] bg-[var(--color-accent)] p-[2.2cqw] text-white">
        <div>
          <AnimatedHeading onDark lines={["LIMITED TIME", "OFFERS"]} className="mb-[0.8cqw] text-[1.6cqw] leading-[1.15] font-medium" />
          <Text className="text-white/85">Enjoy up to 30% off selected styles.</Text>
          <Link href="/shop" className="mt-[1.4cqw] inline-block border-b border-white/70 pb-0.5 text-[clamp(9px,0.78cqw,12px)] text-white">
            Shop the sale →
          </Link>
        </div>
        <div className="grid aspect-square w-[7cqw] min-w-20 shrink-0 place-items-center rounded-full bg-frame text-center text-ink">
          <span>
            <span className="block text-[clamp(8px,0.68cqw,11px)] font-medium tracking-[0.03em]">UP TO</span>
            <span className="block text-[clamp(18px,2.1cqw,28px)] leading-none">30%</span>
            <span className="block text-[clamp(8px,0.68cqw,11px)] font-medium tracking-[0.03em]">OFF</span>
          </span>
        </div>
      </article>
    </Panel>
  );
}
