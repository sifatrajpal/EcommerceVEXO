import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/atoms/Panel";
import { Tag } from "@/components/atoms/Tag";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { HeartButton } from "@/components/atoms/HeartButton";
import { StarIcon } from "@/components/atoms/Icons";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { ShareLinks } from "@/components/molecules/ShareLinks";
import { ProductGallery } from "@/components/molecules/ProductGallery";
import { AddToBagForm } from "@/components/molecules/AddToBagForm";
import { getProductById } from "@/lib/data/queries";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

const SWATCHES = ["#e4d9c6", "#ffffff", "#b3542f", "#141414"];
const SIZES = ["S", "M", "L", "XL"];

// Next.js 15+: route params arrive as a Promise.
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <main className="p-2.5">
      <Panel className="p-[3cqw]">
        <Link href="/" className="mb-[2cqw] inline-block text-[clamp(11px,0.85cqw,13px)] hover:opacity-60">← Back to VEXO</Link>

        <div className="grid gap-[3.4cqw] md:grid-cols-[40%_1fr]">
          <ProductGallery images={[product.imageUrl]} alt={product.name} />

          <div className="flex flex-col gap-[1.3cqw]">
            <Tag className="w-fit bg-panel">{product.season}</Tag>
            <AnimatedHeading as="h1" lines={[product.name.toUpperCase()]} className="text-[3.2cqw] leading-[0.95] font-medium tracking-[-0.04em]" />

            <div className="flex items-center gap-[0.3cqw] text-[#f5a623]">
              {[0, 1, 2, 3].map((i) => <StarIcon key={i} filled className="size-4" />)}
              <StarIcon className="size-4" />
            </div>

            <p className="text-[clamp(18px,1.8cqw,28px)] font-medium">{formatPrice(product.price, product.currency)}</p>
            <Text>Performance-driven gear built for summer heat and winter cold. Breathable, durable, and made to move with you.</Text>

            <div className="mt-[0.6cqw]">
              <p className="mb-[0.6cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">COLOR</p>
              <div className="flex gap-[0.7cqw]">
                {SWATCHES.map((color) => (
                  <span key={color} className="size-[1.6cqw] min-h-6 min-w-6 rounded-full border border-[#e4e5e8]" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-[0.6cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">SIZE</p>
              <div className="flex gap-[0.7cqw]">
                {SIZES.map((size, i) => (
                  <span
                    key={size}
                    className={`grid size-9 place-items-center rounded-full border text-[13px] ${i === 1 ? "border-ink bg-ink text-white" : "border-[#d8dade] text-[#6b7078]"}`}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

            <AddToBagForm
              productId={product.id}
              after={<HeartButton label={product.name} className="size-11 min-h-11 min-w-11 shrink-0 border border-[#e4e5e8] bg-white" />}
            >
              <QuantityStepper />
            </AddToBagForm>

            <div className="mt-[0.8cqw] flex items-center gap-[1cqw]">
              <p className="text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.04em] text-[#8e939a]">SHARE</p>
              <ShareLinks title={product.name} />
            </div>
          </div>
        </div>
      </Panel>
    </main>
  );
}
