import Link from "next/link";
import { Panel } from "@/components/atoms/Panel";
import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { ProductCard } from "@/components/molecules/ProductCard";
import type { Product } from "@/lib/types";
import type { Theme } from "@/lib/data/settings";

const TOPBAR_COPY: Partial<Record<Theme, { left: string; heading: [string, string]; right: string }>> = {
  studio: {
    left: "SHOP ALL",
    heading: ["NEW ARRIVALS FOR", "YOUR WARDROBE"],
    right: "VIEW ALL",
  },
};

export function NewArrivals({ products, theme = "default" }: { products: Product[]; theme?: Theme }) {
  // Studio: fewer per row with more air, matching its boutique/editorial pace.
  // Default/Noir: the original 4-up grid. Élanora gets its own layout below.
  const gridClass =
    theme === "studio"
      ? "grid grid-cols-2 gap-x-[2.2cqw] gap-y-[5cqw] md:grid-cols-3"
      : "grid grid-cols-2 gap-x-[1.1cqw] gap-y-[3.6cqw] md:grid-cols-4";

  // Élanora trades the centered top bar for a left intro column beside the grid —
  // the "New Arrivals" layout from the reference design, same product data either way.
  if (theme === "elanora") {
    return (
      <Panel id="new-arrivals" className="px-[4.1cqw] pt-[3cqw] pb-[3cqw]">
        <div className="grid gap-[3cqw] md:grid-cols-[22%_1fr]">
          <div className="flex flex-col pt-[0.4cqw]">
            <Eyebrow className="mb-[1.6cqw]">New Arrivals</Eyebrow>
            <AnimatedHeading
              lines={["Fresh styles", "just in"]}
              className="text-[3.1cqw] leading-[1.05] font-medium tracking-[-0.01em]"
            />
            <Text className="mt-[1.6cqw] max-w-[90%]">Be the first to shop our latest drops.</Text>
            <Button href="/shop" shape="square" className="mt-[2.6cqw] self-start">SHOP ALL</Button>
          </div>
          <div className="grid grid-cols-2 gap-x-[1.1cqw] gap-y-[3.6cqw] md:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={(i % 4) * 0.12} />
            ))}
          </div>
        </div>
      </Panel>
    );
  }

  const topbar = TOPBAR_COPY[theme];

  return (
    <Panel id="new-arrivals" className="px-[4.1cqw] pt-[1.9cqw] pb-[3cqw]">
      <div className="mirror-grid-arrivals mb-[5.5cqw] grid grid-cols-[1fr_auto_1fr] items-start gap-x-[1.6cqw] text-[clamp(9px,0.85cqw,13px)]">
        <Link href="/shop?sort=newest">{topbar?.left ?? "NEW ARRIVAL"}</Link>
        <AnimatedHeading
          lines={topbar?.heading ?? ["FRESH FITS FOR YOUR", "NEXT WORKOUT!"]}
          className="text-center text-[3.35cqw] leading-[0.92] font-medium tracking-[-0.04em]"
        />
        <Link href="/shop" className="justify-self-end">{topbar?.right ?? "ALL BRANDS"}</Link>
      </div>
      <div className={gridClass}>
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={(i % 4) * 0.12} />
        ))}
      </div>
    </Panel>
  );
}
