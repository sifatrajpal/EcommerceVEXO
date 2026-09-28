import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/types";
import type { ProductSort } from "@/lib/data/queries";

type Props = { category?: ProductCategory; season?: string; sort?: ProductSort };

function buildHref(current: Props, patch: Partial<Props>) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.season) params.set("season", next.season);
  if (next.sort) params.set("sort", next.sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function Radio({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex items-center gap-[0.9cqw] py-[0.55cqw] text-[clamp(12px,0.95cqw,15px)]">
      <span
        className={cn(
          "grid size-[1.1cqw] min-h-4 min-w-4 shrink-0 place-items-center rounded-full border transition-colors",
          active ? "border-ink" : "border-[#d8dade] group-hover:border-[#a7abb2]"
        )}
      >
        {active && <span className="size-[0.55cqw] min-h-2 min-w-2 rounded-full bg-ink" />}
      </span>
      <span className={cn(active ? "text-ink" : "text-[#6b7078] group-hover:text-ink")}>{children}</span>
    </Link>
  );
}

export function ShopFilters(props: Props) {
  const { category, season, sort } = props;
  const hasFilters = category || season || sort;

  return (
    <aside className="sticky top-[10px] flex h-[calc(100svh-20px)] w-[15.5cqw] min-w-[190px] flex-col rounded-[1.4cqw] bg-white p-[1.6cqw]">
      <div className="flex items-center justify-between">
        <h2 className="text-[clamp(13px,1cqw,16px)] font-semibold tracking-[0.02em]">FILTERS</h2>
        {hasFilters && (
          <Link href="/shop" className="text-[clamp(10px,0.8cqw,13px)] text-[#6b7078] underline hover:text-ink">
            Clear
          </Link>
        )}
      </div>

      <div className="mt-[1.8cqw] border-t border-[#eceef0] pt-[1.4cqw]">
        <p className="mb-[0.6cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">CATEGORY</p>
        <Radio href={buildHref(props, { category: undefined })} active={!category}>All</Radio>
        <Radio href={buildHref(props, { category: "men" })} active={category === "men"}>Men</Radio>
        <Radio href={buildHref(props, { category: "women" })} active={category === "women"}>Women</Radio>
        <Radio href={buildHref(props, { category: "unisex" })} active={category === "unisex"}>Unisex</Radio>
      </div>

      <div className="mt-[1.6cqw] border-t border-[#eceef0] pt-[1.4cqw]">
        <p className="mb-[0.6cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">SEASON</p>
        <Radio href={buildHref(props, { season: undefined })} active={!season}>All</Radio>
        <Radio href={buildHref(props, { season: "winter" })} active={season === "winter"}>Winter</Radio>
        <Radio href={buildHref(props, { season: "summer" })} active={season === "summer"}>Summer</Radio>
      </div>

      <div className="mt-[1.6cqw] border-t border-[#eceef0] pt-[1.4cqw]">
        <p className="mb-[0.6cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">SORT BY</p>
        <Radio href={buildHref(props, { sort: undefined })} active={!sort}>Newest</Radio>
        <Radio href={buildHref(props, { sort: "price-asc" })} active={sort === "price-asc"}>Price: Low to High</Radio>
        <Radio href={buildHref(props, { sort: "price-desc" })} active={sort === "price-desc"}>Price: High to Low</Radio>
      </div>

      <div className="mt-auto rounded-[1cqw] bg-panel p-[1.2cqw] text-[clamp(10px,0.82cqw,13px)] text-[#6b7078]">
        Free shipping on all orders over $100.
      </div>
    </aside>
  );
}
