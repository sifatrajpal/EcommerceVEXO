import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/atoms/Panel";
import { Tag } from "@/components/atoms/Tag";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { LikeButton } from "@/components/atoms/LikeButton";
import { StarIcon } from "@/components/atoms/Icons";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { SizeSelector } from "@/components/molecules/SizeSelector";
import { ShareLinks } from "@/components/molecules/ShareLinks";
import { ProductGallery } from "@/components/molecules/ProductGallery";
import { AddToBagForm } from "@/components/molecules/AddToBagForm";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { ProductAccordion } from "@/components/organisms/ProductAccordion";
import { ExploreOthers } from "@/components/organisms/ExploreOthers";
import { getProductById, getProducts } from "@/lib/data/queries";
import { getSizes, getColors } from "@/lib/data/catalog-meta";
import { formatPrice, isRecentlyAdded } from "@/lib/utils";

export const revalidate = 60;

const DEFAULT_SWATCHES = [
  { id: "sand", name: "Sand", hex: "#e4d9c6" },
  { id: "white", name: "White", hex: "#ffffff" },
  { id: "rust", name: "Rust", hex: "#b3542f" },
  { id: "black", name: "Black", hex: "#141414" },
];
const DESCRIPTION =
  "Performance-driven gear built for summer heat and winter cold. Cut from a breathable cotton-poly blend with four-way stretch, reinforced stitching at the seams, and a relaxed fit that moves with you through every rep — from warmup to cooldown.";

// Next.js 15+: route params arrive as a Promise.
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, others, sizes, colors] = await Promise.all([
    getProductById(id),
    getProducts(),
    getSizes(),
    getColors(),
  ]);
  if (!product) notFound();

  const isNew = product.isNewArrival && isRecentlyAdded(product.createdAt);
  const otherProducts = others.filter((p) => p.id !== product.id).slice(0, 4);
  const swatches = colors.length > 0 ? colors : DEFAULT_SWATCHES;
  const sizeNames = sizes.length > 0 ? sizes.map((s) => s.name) : undefined;

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

            <div className="flex items-center gap-[0.3cqw] text-[#f5a623]">
              {[0, 1, 2, 3].map((i) => <StarIcon key={i} filled className="size-4" />)}
              <StarIcon className="size-4" />
            </div>

            <p className="text-[clamp(18px,1.8cqw,28px)] font-medium">{formatPrice(product.price, product.currency)}</p>
            <p className="text-[clamp(11px,0.9cqw,14px)] leading-[1.5] text-ink">{DESCRIPTION}</p>

            <div className="mt-[0.6cqw]">
              <p className="mb-[0.6cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">COLOR</p>
              <div className="flex gap-[0.7cqw]">
                {swatches.map((color) => (
                  <span
                    key={color.id}
                    title={color.name}
                    className="size-[1.6cqw] min-h-6 min-w-6 rounded-full border border-[#e4e5e8]"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-[0.6cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">SIZE</p>
              <SizeSelector sizes={sizeNames} />
            </div>

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

        <ProductAccordion description={DESCRIPTION} brand={product.brand} material={product.material} />
        <ExploreOthers products={otherProducts} />
      </Panel>
    </main>
  );
}
