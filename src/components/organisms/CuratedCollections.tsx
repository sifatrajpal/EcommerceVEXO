import Link from "next/link";
import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { RevealImage } from "@/components/atoms/RevealImage";
import { THEME_IMAGES } from "@/lib/theme-images";

const images = THEME_IMAGES.studio;

const COLLECTIONS = [
  { title: "CITY MINIMALIST", note: "Clean. Modern. Timeless.", image: images.pickA },
  { title: "WEEKEND ESCAPE", note: "Relaxed pieces for easy days.", image: images.featureAthlete },
  { title: "QUIET LUXURY", note: "Tailored looks that whisper.", image: images.cutoutHood },
  { title: "SUNSET HUES", note: "Warm tones for golden hours.", image: images.posterGroup },
];

/** Studio-only: a sage band of arch-shaped category cards, echoing the reference's "Curated Collections" row. */
export function CuratedCollections() {
  return (
    <Panel background="bg-[var(--color-accent)]" className="grid gap-[3cqw] px-[3.4cqw] py-[3.6cqw] text-white md:grid-cols-[26%_1fr]">
      <div className="pt-[0.4cqw]">
        <Eyebrow className="mb-[1.4cqw] text-white/80">Curated Collections</Eyebrow>
        <AnimatedHeading
          onDark
          lines={["HANDPICKED FOR", "EVERY MOOD"]}
          className="mb-[1.6cqw] text-[2.6cqw] leading-[1.05] font-medium"
        />
        <Text className="max-w-[90%] text-white/85 max-md:max-w-none">
          A small edit of looks for every occasion and season — chosen, not mass-produced.
        </Text>
        <Link
          href="/shop"
          className="mt-[1.8cqw] inline-block border-b border-white/70 pb-0.5 text-[clamp(10px,0.85cqw,13px)] text-white"
        >
          View all collections →
        </Link>
      </div>

      <div className="flex flex-wrap justify-between gap-x-[1.6cqw] gap-y-[2.4cqw]">
        {COLLECTIONS.map((c, i) => (
          <Link key={c.title} href="/shop" className="flex w-[21%] min-w-32 flex-col items-center text-center max-sm:w-[46%]">
            <RevealImage
              src={c.image}
              alt={c.title}
              delay={i * 0.08}
              sizes="20vw"
              className="relative aspect-[3/4] w-full rounded-t-[999px] rounded-b-[6px]"
            />
            <p className="mt-[1cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.03em]">{c.title}</p>
            <p className="mt-[0.3cqw] text-[clamp(9px,0.72cqw,12px)] text-white/75">{c.note}</p>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
