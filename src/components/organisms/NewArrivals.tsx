import Link from "next/link";
import { Panel } from "@/components/atoms/Panel";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { ProductCard } from "@/components/molecules/ProductCard";
import type { Product } from "@/lib/types";

export function NewArrivals({ products }: { products: Product[] }) {
  return (
    <Panel id="new-arrivals" className="px-[4.1cqw] pt-[1.9cqw] pb-[3cqw]">
      <div className="mb-[5.5cqw] grid grid-cols-[1fr_auto_1fr] items-start text-[clamp(9px,0.85cqw,13px)]">
        <Link href="/shop?sort=newest">NEW ARRIVAL</Link>
        <AnimatedHeading
          lines={["FRESH FITS FOR YOUR", "NEXT WORKOUT!"]}
          className="text-center text-[3.35cqw] leading-[0.92] font-medium tracking-[-0.04em]"
        />
        <Link href="/shop" className="justify-self-end">ALL BRANDS</Link>
      </div>
      <div className="grid grid-cols-2 gap-x-[1.1cqw] gap-y-[3.6cqw] md:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={(i % 4) * 0.12} />
        ))}
      </div>
    </Panel>
  );
}
