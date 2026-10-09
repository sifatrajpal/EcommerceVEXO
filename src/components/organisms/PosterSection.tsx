import { Panel } from "@/components/atoms/Panel";
import { ScrollText } from "@/components/atoms/ScrollText";
import { RevealImage } from "@/components/atoms/RevealImage";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";

/** Centered poster card with giant grey text sliding behind it. */
export function PosterSection() {
  return (
    <Panel data-scroll-section className="aspect-[935/555]">
      <ScrollText text="FRESH FOR YOUR NEXT WORKOUT FRESH FOR YOUR" direction={-1} offset={-0.02} className="top-[16%] z-10 text-[10.2cqw] font-light text-ghost" />
      <ScrollText text="YOUR NEXT WORKOUT YOUR NEXT WORKOUT" direction={1} offset={-0.12} className="top-[71%] z-10 text-[10.2cqw] font-light text-ghost" />

      <RevealImage
        src="/images/poster-group.png"
        alt="Model in a beige trench coat and jeans, the latest season line-up"
        sizes="35vw"
        className="absolute top-[8.5%] left-[32.6%] z-20 h-[78.6%] w-[34.3%] rounded-[1.9cqw]"
      >
        <div className="absolute inset-0 pt-[4.8%] text-center text-white">
          <p className="text-[clamp(10px,1.5cqw,18px)] tracking-[0.06em]">VEXO</p>
          <p className="mt-[1.2cqw] mb-[0.6cqw] text-[clamp(8px,0.62cqw,11px)]">LEVEL UP</p>
          <AnimatedHeading onDark lines={["WITH THE LATEST IN", "WORKOUT WEAR"]} className="text-[2.6cqw] leading-[0.95] font-medium tracking-[-0.03em]" />
        </div>
      </RevealImage>
    </Panel>
  );
}
