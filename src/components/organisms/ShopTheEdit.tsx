"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Panel } from "@/components/atoms/Panel";
import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { Tag } from "@/components/atoms/Tag";
import { ArrowUpRightIcon } from "@/components/atoms/Icons";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { RevealImage } from "@/components/atoms/RevealImage";
import { TabBar } from "@/components/molecules/TabBar";
import type { EditTab } from "@/lib/types";
import type { Theme } from "@/lib/data/settings";
import { THEME_IMAGES } from "@/lib/theme-images";

const DEFAULT_COPY = {
  heading: ["BUILT FOR EVERY", "SEASON & REP"],
  body: "Performance-driven gear for men and women, designed for summer heat and winter cold. Breathable layers, insulated shells and everyday essentials that move with you.",
  cardHeading: ["COZY LAYERS,", "HEAT READY"],
  cardBody: "Thermal hoods, face covers and caps that lock in warmth without the bulk.",
  cardLink: "Explore layers",
};

const COPY: Partial<Record<Theme, typeof DEFAULT_COPY>> = {
  elanora: {
    heading: ["TIMELESS PIECES FOR", "EVERY OCCASION"],
    body: "Elevated everyday essentials, designed to take you from your morning coffee run to your evening plans — without missing a beat.",
    cardHeading: ["SOFT KNITS,", "ELEVATED"],
    cardBody: "Lightweight knits and tailored layers that transition effortlessly from day to night.",
    cardLink: "Explore knitwear",
  },
  studio: {
    heading: ["CURATED ESSENTIALS FOR", "EVERY OCCASION"],
    body: "Thoughtfully edited pieces that layer easily from a quiet morning to a city evening — cut from fabrics built to last.",
    cardHeading: ["QUIET LUXURY,", "WARM TONES"],
    cardBody: "Soft knits and tailored layers in a palette built around sage, terracotta and cream.",
    cardLink: "Explore the edit",
  },
};

/**
 * Tabs pipeline: click tab → setActive(i) → new imageA/imageB src
 * → RevealImage fades the old picture out, swaps it, then fades the new one in.
 */
export function ShopTheEdit({ tabs, theme = "default" }: { tabs: EditTab[]; theme?: Theme }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  const images = THEME_IMAGES[theme];
  const copy = COPY[theme] ?? DEFAULT_COPY;
  // The tuned crop below was picked for the default photos; every other theme's swapped-in
  // photo gets a top-anchored crop instead, so full-body shots don't get their faces cut off.
  const tunedCrop = theme === "default";

  return (
    <Panel className="px-[3.4cqw] pt-[4.2cqw] pb-[3.4cqw]">
      <div className="mirror-grid-edit-main grid items-start gap-[4.5cqw] md:grid-cols-[34%_1fr] ">
        {/* Copy */}
        <div className="pt-[0.6cqw]">
          <Eyebrow className="mb-[1.6cqw] text-[#8e939a]">Collection</Eyebrow>
          <AnimatedHeading
            lines={copy.heading}
            className="mb-[2cqw] text-[4.1cqw] leading-[0.95] font-medium tracking-[-0.04em]"
          />
          <Text className="max-w-[28cqw] max-md:max-w-none">{copy.body}</Text>
          <Button href="#new-arrivals" shape="square" className="mt-[3cqw]">SHOP THE EDIT</Button>
        </div>

        {/* Tabs + two pictures */}
        <div>
          <TabBar tabs={tabs} active={active} onChange={setActive} label="Shop by category" />
          <div role="tabpanel" aria-label={tab.label} className="mt-[2cqw] grid grid-cols-[1.15fr_1fr] gap-[2.2cqw]">
            <Link href="/shop" aria-label="Shop the collection" className="contents">
              <RevealImage
                src={tab.imageA}
                alt={`${tab.label} look`}
                sizes="(max-width: 768px) 55vw, 30vw"
                className="relative h-[26cqw] rounded-[1.4cqw] max-md:h-[55cqw]"
                imgClassName="object-[50%_25%]"
              />
            </Link>
            <Link href="/shop" aria-label="Shop the collection" className="contents">
              <RevealImage
                src={tab.imageB}
                alt={`${tab.label} detail`}
                delay={0.12}
                sizes="(max-width: 768px) 45vw, 25vw"
                className="relative h-[26cqw] rounded-[1.4cqw] max-md:h-[55cqw]"
                imgClassName="object-[50%_30%]"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mirror-grid-edit-bottom mt-[3cqw] grid gap-[2.8cqw] md:grid-cols-2">
        <article className="relative aspect-[1.8] overflow-hidden rounded-[1.8cqw] bg-[linear-gradient(135deg,#f6f6f4,#e2e4e6)] max-md:aspect-[1.4]">
          <div className="relative z-10 max-w-[55%] px-[3cqw] py-[3.2cqw]">
            <AnimatedHeading
              as="h3"
              lines={copy.cardHeading}
              className="mb-[1.3cqw] text-[2.4cqw] leading-[0.98] font-medium tracking-[-0.03em]"
            />
            <Text>{copy.cardBody}</Text>
            <Link href="/shop?season=winter" className="group mt-[1.8cqw] inline-block border-b border-ink pb-0.5 text-[clamp(10px,0.88cqw,14px)]">
              {copy.cardLink} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <Link
            href="/shop?season=winter"
            aria-label="Shop layers"
            className="absolute inset-y-0 right-0 w-[52%] [mask-image:linear-gradient(to_right,transparent,black_18%)]"
          >
            <Image
              src={images.cutoutHood}
              alt="Model wearing the featured cozy layer"
              fill
              sizes="25vw"
              className={tunedCrop ? "object-cover object-[65%_35%]" : "object-cover object-top"}
            />
          </Link>
        </article>

        <Link href="/shop" aria-label="Open lookbook" className="contents">
          <RevealImage
            src={images.posterGroup}
            alt="Model from the current lookbook"
            delay={0.12}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="relative aspect-[1.8] rounded-[1.8cqw] max-md:aspect-[1.4]"
            imgClassName={tunedCrop ? "object-[50%_22%]" : "object-top"}
          >
            <Tag className="absolute top-[1.6cqw] left-[1.6cqw] text-[#141414]">LOOKBOOK 2026</Tag>
            <span
              aria-hidden
              className="absolute right-[1.6cqw] bottom-[1.6cqw] grid size-[3.2cqw] min-h-7.5 min-w-7.5 place-items-center rounded-full bg-frame transition-transform duration-300 hover:rotate-45 [&>svg]:w-[45%]"
            >
              <ArrowUpRightIcon />
            </span>
          </RevealImage>
        </Link>
      </div>
    </Panel>
  );
}
