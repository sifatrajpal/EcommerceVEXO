"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Panel } from "@/components/atoms/Panel";
import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { Tag } from "@/components/atoms/Tag";
import { IconCircle } from "@/components/atoms/IconCircle";
import { ArrowUpRightIcon } from "@/components/atoms/Icons";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { RevealImage } from "@/components/atoms/RevealImage";
import { TabBar } from "@/components/molecules/TabBar";
import type { EditTab } from "@/lib/types";

/**
 * Tabs pipeline: click tab → setActive(i) → new imageA/imageB src
 * → RevealImage fades the old picture out, swaps it, then fades the new one in.
 */
export function ShopTheEdit({ tabs }: { tabs: EditTab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <Panel className="px-[3.4cqw] pt-[4.2cqw] pb-[3.4cqw] bg-slate-50">
      <div className="grid items-start gap-[4.5cqw] md:grid-cols-[34%_1fr] ">
        {/* Copy */}
        <div className="pt-[0.6cqw]">
          <Eyebrow className="mb-[1.6cqw] text-[#8e939a]">Collection</Eyebrow>
          <AnimatedHeading
            lines={["BUILT FOR EVERY", "SEASON & REP"]}
            className="mb-[2cqw] text-[4.1cqw] leading-[0.95] font-medium tracking-[-0.04em]"
          />
          <Text className="max-w-[28cqw] max-md:max-w-none">
            Performance-driven gear for men and women, designed for summer heat and winter cold. Breathable layers,
            insulated shells and everyday essentials that move with you.
          </Text>
          <Button href="#new-arrivals" shape="square" className="mt-[3cqw]">SHOP THE EDIT</Button>
        </div>

        {/* Tabs + two pictures */}
        <div>
          <TabBar tabs={tabs} active={active} onChange={setActive} label="Shop by category" />
          <div role="tabpanel" aria-label={tab.label} className="mt-[2cqw] grid grid-cols-[1.15fr_1fr] gap-[2.2cqw]">
            <RevealImage
              src={tab.imageA}
              alt={`${tab.label} look`}
              sizes="(max-width: 768px) 55vw, 30vw"
              className="relative h-[26cqw] rounded-[1.4cqw] max-md:h-[55cqw]"
              imgClassName="object-[50%_25%]"
            />
            <RevealImage
              src={tab.imageB}
              alt={`${tab.label} detail`}
              delay={0.12}
              sizes="(max-width: 768px) 45vw, 25vw"
              className="relative h-[26cqw] rounded-[1.4cqw] max-md:h-[55cqw]"
              imgClassName="object-[50%_30%]"
            />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-[3cqw] grid gap-[2.8cqw] md:grid-cols-2">
        <article className="relative aspect-[1.8] overflow-hidden rounded-[1.8cqw] bg-[linear-gradient(135deg,#f6f6f4,#e2e4e6)] max-md:aspect-[1.4]">
          <div className="relative z-10 max-w-[55%] px-[3cqw] py-[3.2cqw]">
            <AnimatedHeading
              as="h3"
              lines={["COZY LAYERS,", "HEAT READY"]}
              className="mb-[1.3cqw] text-[2.4cqw] leading-[0.98] font-medium tracking-[-0.03em]"
            />
            <Text>Thermal hoods, face covers and caps that lock in warmth without the bulk.</Text>
            <Link href="/shop?season=winter" className="group mt-[1.8cqw] inline-block border-b border-ink pb-0.5 text-[clamp(10px,0.88cqw,14px)]">
              Explore layers <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="absolute inset-y-0 right-0 w-[52%] [mask-image:linear-gradient(to_right,transparent,black_18%)]">
            <Image
              src="/images/cutout-hood.png"
              alt="Model in a white tank top with a black blazer draped over one shoulder"
              fill
              sizes="25vw"
              className="object-cover object-[65%_35%]"
            />
          </div>
        </article>

        <RevealImage
          src="/images/poster-group.png"
          alt="Model in a beige trench coat and jeans for the new season line-up"
          delay={0.12}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="relative aspect-[1.8] rounded-[1.8cqw] max-md:aspect-[1.4]"
          imgClassName="object-[50%_22%]"
        >
          <Tag className="absolute top-[1.6cqw] left-[1.6cqw]">LOOKBOOK 2026</Tag>
          <IconCircle label="Open lookbook" href="/shop" className="absolute right-[1.6cqw] bottom-[1.6cqw] size-[3.2cqw] min-h-7.5 min-w-7.5 bg-white transition-transform duration-300 hover:rotate-45">
            <ArrowUpRightIcon />
          </IconCircle>
        </RevealImage>
      </div>
    </Panel>
  );
}
