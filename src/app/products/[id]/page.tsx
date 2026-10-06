import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/atoms/Panel";
import { Tag } from "@/components/atoms/Tag";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { LikeButton } from "@/components/atoms/LikeButton";
import { StarIcon } from "@/components/atoms/Icons";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { SizeColorPicker } from "@/components/molecules/SizeColorPicker";
import { ShareLinks } from "@/components/molecules/ShareLinks";
import { ProductGallery } from "@/components/molecules/ProductGallery";
import { AddToBagForm } from "@/components/molecules/AddToBagForm";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { ProductAccordion } from "@/components/organisms/ProductAccordion";
import { ExploreOthers } from "@/components/organisms/ExploreOthers";
import { getProductById, getProducts } from "@/lib/data/queries";
import { getSizes, getColors } from "@/lib/data/catalog-meta";
import { getReviews, getRatingSummary } from "@/lib/data/reviews";
import { getProductVariants } from "@/lib/data/inventory";
import { formatPrice, isRecentlyAdded } from "@/lib/utils";

export const revalidate = 60;

const DESCRIPTION =
  "Performance-driven gear built for summer heat and winter cold. Cut from a breathable cotton-poly blend with four-way stretch, reinforced stitching at the seams, and a relaxed fit that moves with you through every rep — from warmup to cooldown.";

// Next.js 15+: route params arrive as a Promise.
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, others, sizes, colors, reviews, ratingSummary, variants] = await Promise.all([
    getProductById(id),
    getProducts(),
    getSizes(),
    getColors(),
    getReviews(id),
    getRatingSummary(id),
    getProductVariants(id),
  ]);
  if (!product) notFound();

  const isNew = product.isNewArrival && isRecentlyAdded(product.createdAt);
  const otherProducts = others.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />
      <Panel className="p-[3cqw]">
        <Link href="/" className="mb-[2cqw] inline-block text-[clamp(11px,0.85cqw,13px)] hover:opacity-60">← Back to VEXO</Link>

        <div className="grid gap-[3.4cqw] md:grid-cols-[40%_1fr]">
          <ProductGallery images={[product.imageUrl]} alt={product.name} />

          <div className="flex flex-col gap-[1.3cqw]">
            <div className="flex flex-wrap items-center gap-[0.6cqw]">
              <Tag className="bg-panel">{product.season}</Tag>
              {product.collection && <Tag className="bg-panel">{product.collection}</Tag>}
              {isNew && <span className="inline-grid place-items-center rounded-full bg-ink px-[1.1cqw] py-[0.45cqw] text-[clamp(9px,0.78cqw,12px)] text-white">New</span>}
            </div>
            <AnimatedHeading as="h1" lines={[product.name.toUpperCase()]} className="text-[3.2cqw] leading-[0.95] font-medium tracking-[-0.04em]" />

            <div className="flex items-center gap-[0.5cqw] text-[#f5a623]">
              <div className="flex gap-[0.3cqw]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < Math.round(ratingSummary.average)} className="size-4" />
                ))}
              </div>
              <span className="text-[clamp(11px,0.85cqw,14px)] text-[#6b7078]">
                {ratingSummary.count > 0
                  ? `${ratingSummary.average.toFixed(1)} · ${ratingSummary.count} rating${ratingSummary.count === 1 ? "" : "s"}`
                  : "No ratings yet"}
              </span>
            </div>

            <p className="text-[clamp(18px,1.8cqw,28px)] font-medium">{formatPrice(product.price, product.currency)}</p>
            <p className="text-[clamp(11px,0.9cqw,14px)] leading-[1.5] text-ink">{DESCRIPTION}</p>

            <SizeColorPicker variants={variants} fallbackSizes={sizes} fallbackColors={colors} />

            <AddToBagForm
              productId={product.id}
              after={
                <LikeButton
                  productId={product.id}
                  label={product.name}
                  showCount
                  className="shrink-0"
                />
              }
            >
              <QuantityStepper />
            </AddToBagForm>

            <div className="mt-[0.8cqw] flex items-center gap-[1cqw]">
              <p className="text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">SHARE</p>
              <ShareLinks title={product.name} />
            </div>
          </div>
        </div>

        <ProductAccordion
          productId={product.id}
          description={DESCRIPTION}
          brand={product.brand}
          material={product.material}
          reviews={reviews}
          ratingAverage={ratingSummary.average}
          ratingCount={ratingSummary.count}
        />
        <ExploreOthers products={otherProducts} />
      </Panel>
    </main>
  );
}
