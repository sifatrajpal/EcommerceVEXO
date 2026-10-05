import Link from "next/link";
import { ProductCard } from "@/components/molecules/ProductCard";
import type { Product } from "@/lib/types";

export function ExploreOthers({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="mt-[3.2cqw]">
      <div className="mb-[1.8cqw] flex items-end justify-between">
        <h2 className="text-[clamp(22px,2.4cqw,34px)] font-bold tracking-tight">Explore Others</h2>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-1.5 text-[clamp(12px,0.95cqw,15px)] font-semibold text-ink"
        >
          View all
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-[1.4cqw] gap-y-[2.4cqw] md:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={(i % 4) * 0.1} />
        ))}
      </div>
    </div>
  );
}
