import Link from "next/link";
import { Panel } from "@/components/atoms/Panel";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { SubscribeForm } from "@/components/molecules/SubscribeForm";
import { FooterColumn } from "@/components/molecules/FooterColumn";
import { footerColumns } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/data/settings";

const DEFAULT_COPY = {
  heading: ["JOIN THE VEXO", "CLUB"],
  blurb: "New drops, restocks and training edits, straight to your inbox. No spam, just gear.",
  copyright: "© 2026 VEXO. All rights reserved.",
};

const COPY: Partial<Record<Theme, typeof DEFAULT_COPY>> = {
  elanora: {
    heading: ["JOIN", "ÉLANORA"],
    blurb: "Subscribe for early access to new arrivals, exclusive offers and style inspiration. No spam, just style.",
    copyright: "© 2026 ÉLANORA. All rights reserved.",
  },
  studio: {
    heading: ["JOIN", "VERDE"],
    blurb: "Subscribe for early access to new collections, exclusive offers and style inspiration. No spam, just style.",
    copyright: "© 2026 VERDE. All rights reserved.",
  },
};

const WORDMARK: Partial<Record<Theme, string>> = { elanora: "ÉLANORA", studio: "VERDE" };

// Studio trades the near-black footer every other theme shares for a sage-green one,
// echoing the reference design's green footer band.
const BACKGROUND: Partial<Record<Theme, string>> = { studio: "bg-[var(--color-accent)]" };

export function SiteFooter({ theme = "default" }: { theme?: Theme }) {
  const copy = COPY[theme] ?? DEFAULT_COPY;
  const wordmark = WORDMARK[theme] ?? "VEXO";
  const studio = theme === "studio";
  const blurbTone = studio ? "text-white/80" : "text-[#9a9ea5]";
  const borderTone = studio ? "border-white/20" : "border-[#2a2a2a]";
  const legalTone = studio ? "text-white/70" : "text-[#7d8189]";
  const legalHover = studio ? "hover:text-white" : "hover:text-[#e9ebed]";
  return (
    <Panel as="footer" background={BACKGROUND[theme] ?? "bg-[#121212]"} className="px-[4cqw] pt-[4.5cqw] text-[#e9ebed]">
      <div className="grid gap-[6cqw] md:grid-cols-[1.3fr_2fr]">
        <div>
          <AnimatedHeading onDark lines={copy.heading} className="mb-[1.6cqw] text-[3.35cqw] leading-[0.92] font-medium tracking-[-0.04em]" />
          <Text className={cn("max-w-[26cqw] max-md:max-w-none", blurbTone)}>{copy.blurb}</Text>
          <SubscribeForm />
        </div>
        <div className="grid grid-cols-3 gap-[2cqw]">
          {footerColumns.map((c) => <FooterColumn key={c.title} {...c} />)}
        </div>
      </div>

      <AnimatedHeading
        as="p"
        onDark
        lines={[wordmark]}
        className={`pointer-events-none mt-[4cqw] text-center leading-[0.78] font-extralight tracking-[-0.02em] whitespace-nowrap [font-stretch:125%] ${
          theme === "elanora" ? "text-[15cqw]" : theme === "studio" ? "text-[21cqw]" : "text-[27cqw]"
        }`}
      />

      <div className={cn("relative z-10 flex flex-wrap items-center justify-between gap-[0.8cqw] border-t pt-[1.4cqw] pb-[1.8cqw] text-[clamp(10px,0.8cqw,13px)]", borderTone, legalTone)}>
        <span>{copy.copyright}</span>
        <nav aria-label="Legal" className="flex gap-[2.2cqw]">
          <Link href="/privacy" className={cn("transition-colors hover:underline underline-offset-4", legalHover)}>Privacy</Link>
          <Link href="/terms" className={cn("transition-colors hover:underline underline-offset-4", legalHover)}>Terms</Link>
          <Link href="/cookies" className={cn("transition-colors hover:underline underline-offset-4", legalHover)}>Cookies</Link>
        </nav>
        <a
          href="https://inspiringwave.in/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn("cursor-pointer transition-colors hover:underline underline-offset-4", legalHover)}
        >
          Designed and developed by INSPIRING WAVE
        </a>
      </div>
    </Panel>
  );
}
