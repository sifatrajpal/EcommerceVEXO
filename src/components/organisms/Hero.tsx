import Image from "next/image";
import { Panel } from "@/components/atoms/Panel";
import { Button } from "@/components/atoms/Button";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { HeroNote } from "@/components/molecules/HeroNote";
import { VideoCard } from "@/components/molecules/VideoCard";
import { SiteHeader } from "./SiteHeader";

// Line end points (in a 921×540 box) radiating from behind the model.
const RAYS = [[120, 175], [60, 250], [20, 360], [150, 450], [790, 175], [870, 250], [910, 360], [780, 450]];

/**
 * Load sequence (CSS only, driven by animation-delay):
 * model holds large, then zooms out (0s hold to ~0.64s, shrinks to 1.6s), then everything
 * else reveals after it settles: header 1.6s → heading letters (~1.8s+) → lines 2s →
 * buttons 2.7s → note 2.9s → video 3s
 */
export function Hero() {
  return (
    <Panel background="bg-[linear-gradient(180deg,#cfe8fb_0%,#e6f3fc_45%,#ffffff_100%)]" className="notch aspect-[921/495] min-h-[520px]">
      <svg className="hero-lines absolute inset-0 h-full w-full" viewBox="0 0 921 540" preserveAspectRatio="none" aria-hidden>
        <g stroke="#fff" strokeWidth={1} opacity={0.75}>
          {RAYS.map(([x, y], i) => <line key={i} x1={455} y1={340} x2={x} y2={y} />)}
        </g>
      </svg>

      <SiteHeader />

      <AnimatedHeading
        as="h1"
        lines={["GEAR UP EVERY SEASON", [{ text: "EVERY " }, { text: "WORKOUT", tone: "stripe" }, { text: "!" }]]}
        className="relative z-20 mt-[5.2cqw] text-center text-[5.1cqw] leading-[0.95] font-medium tracking-[-0.04em]"
        baseDelay={1.2}
      />

      <div className="relative z-20 mt-[2.2cqw] flex animate-up justify-center gap-[0.6cqw] [animation-delay:2.7s]">
        <Button href="/shop">SHOP NOW</Button>
        <Button href="/shop" variant="light">EXPLORE ALL</Button>
      </div>

      <div className="relative z-10 mt-[1.6cqw] flex justify-center">
        <Image
          src="/images/hero-model.png"
          alt="Model in an oversized black hoodie adjusting his sunglasses"
          width={1200}
          height={1879}
          priority
          sizes="24vw"
          className="pointer-events-none w-[24cqw] origin-center animate-hero-zoom"
        />
      </div>

      <HeroNote text="Stay cozy without compromising your range of motion. Our women's winter range is perfect for those chilly outdoor workouts." />
      <VideoCard thumbnail="/images/video-thumb.png" />
    </Panel>
  );
}
