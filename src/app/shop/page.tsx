import { Panel } from "@/components/atoms/Panel";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { RevealImage } from "@/components/atoms/RevealImage";
import { ProductCard } from "@/components/molecules/ProductCard";
import { ShopFilters } from "@/components/organisms/ShopFilters";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { getProducts, type ProductSort } from "@/lib/data/queries";
import type { ProductCategory } from "@/lib/types";

export const revalidate = 60;

const TITLES: Record<ProductCategory | "all", string> = {
  all: "SHOP EVERYTHING",
  men: "MEN'S COLLECTION",
  women: "WOMEN'S COLLECTION",
  unisex: "UNISEX COLLECTION",
};

const SORTS: ProductSort[] = ["newest", "price-asc", "price-desc"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; season?: string; sort?: string }>;
}) {
  const { category, season, sort } = await searchParams;
  const validCategory = category === "men" || category === "women" || category === "unisex" ? category : undefined;
  const validSeason = season === "winter" || season === "summer" ? season : undefined;
  const validSort = SORTS.includes(sort as ProductSort) ? (sort as ProductSort) : undefined;

  const products = await getProducts({ category: validCategory, season: validSeason, sort: validSort });

  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />
      <Panel className="px-[2.6cqw] pt-[2.6cqw] pb-[3cqw]">
        <div className="flex gap-[2.2cqw]">
          <ShopFilters category={validCategory} season={validSeason} sort={validSort} />

          <div className="min-w-0 flex-1">
            <RevealImage
              src="/images/arrival-6.png"
              alt="New season editorial campaign"
              priority
              sizes="(max-width: 768px) 100vw, 70vw"
              className="relative mt-[2cqw] aspect-[3/1] rounded-[1.8cqw]"
              imgClassName="object-[50%_10%]"
            >
              <div className="absolute inset-0 rounded-[1.8cqw] bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
              <p className="absolute bottom-[1.6cqw] left-[1.8cqw] text-[clamp(20px,2.4cqw,36px)] text-white italic">New Season</p>
            </RevealImage>

            <div className="mt-[2.4cqw] mb-[2.4cqw] flex flex-wrap items-end justify-between gap-4">
              <AnimatedHeading
                lines={[TITLES[validCategory ?? "all"]]}
                className="text-[3cqw] leading-[0.92] font-medium tracking-[-0.04em]"
              />
              <p className="text-[clamp(10px,0.85cqw,13px)] text-[#8e939a]">
                {products.length} {products.length === 1 ? "item" : "items"}
              </p>
            </div>

            {products.length === 0 ? (
              <p className="py-[4cqw] text-center text-[#6b7078]">No products match these filters yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-[1.4cqw] gap-y-[2.4cqw] md:grid-cols-3 md:grid-flow-dense">
                {products.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    delay={(i % 3) * 0.12}
                    className={i === 0 ? "col-span-2 row-span-1" : undefined}
                    imageClassName={i === 0 ? "aspect-[5/4]" : undefined}
                    objectPosition={i === 0 ? "object-[50%_20%]" : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Panel>
    </main>
  );
}
