import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { RevealImage } from "@/components/atoms/RevealImage";

export function TopPicks() {
  return (
    <Panel id="top-picks" className="px-[2.6cqw] pt-[1.4cqw] pb-[2.6cqw]">
      <Eyebrow>OUR TOP PICKS</Eyebrow>
      <div className="mt-[2.2cqw] mb-[2.8cqw] flex items-start justify-between gap-6">
        <AnimatedHeading
          lines={["TOP WORKOUT GEAR FOR", "PEAK PERFORMANCE!"]}
          className="text-[3.9cqw] leading-[0.92] font-medium tracking-[-0.04em]"
        />
        <Text className="mt-[1.5cqw] w-[17.5cqw] text-[clamp(9px,0.8cqw,13px)]">
          Discover the best of our collection, designed to power your workouts all year round
        </Text>
      </div>

      <div className="grid grid-cols-[1fr_1.5fr_1fr] items-start gap-[3.2cqw]">
        <div className="flex flex-col gap-[1.2cqw] animate-float">
          <RevealImage
            src="/images/arrival-6.png"
            alt="Model in a tailored brown suit from the Women Originals line"
            sizes="(max-width: 768px) 30vw, 18vw"
            className="relative aspect-[3/2] rounded-[1.6cqw]"
            imgClassName="object-top"
          />
          <Text>Performance-driven gear for everyone — built for summer heat and winter cold.</Text>
        </div>

        <RevealImage
          src="/images/feature-athlete.png"
          alt="Model in dark, moody streetwear"
          delay={0.12}
          sizes="(max-width: 768px) 40vw, 28vw"
          className="relative aspect-[4/5] rounded-[1.6cqw] animate-float [animation-delay:1.5s]"
          imgClassName="object-top"
        />

        <div className="flex h-full flex-col gap-[1.2cqw] self-stretch animate-float [animation-delay:3s]">
          <Text>Stay warm, stay fit. Our winter workout wear blends insulation with flexibility to keep you going in the toughest conditions.</Text>
          <RevealImage
            src="/images/arrival-3.png"
            alt="Model in an olive suit set from the Women Originals line"
            delay={0.24}
            sizes="(max-width: 768px) 30vw, 18vw"
            className="relative mt-auto aspect-[3/2] rounded-[1.6cqw]"
            imgClassName="object-top"
          />
        </div>
      </div>
    </Panel>
  );
}
