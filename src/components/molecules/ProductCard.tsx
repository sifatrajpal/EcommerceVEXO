import Link from "next/link";
import { RevealImage } from "@/components/atoms/RevealImage";
import { LikeButton } from "@/components/atoms/LikeButton";
import { Tag } from "@/components/atoms/Tag";
import { QuickAddButton } from "@/components/molecules/QuickAddButton";
import { formatPrice, cn, isRecentlyAdded } from "@/lib/utils";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  delay?: number;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
};

export function ProductCard({ product, delay = 0, className, imageClassName = "aspect-[203/279]", objectPosition }: Props) {
  const isNew = product.isNewArrival && isRecentlyAdded(product.createdAt);

  return (
    <article className={className}>
      <Link href={`/products/${product.id}`}>
        <RevealImage
          src={product.imageUrl}
          alt={product.name}
          delay={delay}
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn("relative rounded-[1.4cqw] bg-panel", imageClassName)}
          imgClassName={objectPosition}
        >
          {(isNew || product.collection) && (
            <div className="absolute top-[1cqw] left-[1cqw] flex flex-col items-start gap-[0.4cqw]">
              {isNew && (
                <span className="inline-grid place-items-center rounded-full bg-ink px-[1.1cqw] py-[0.45cqw] text-[clamp(9px,0.78cqw,12px)] text-white">
                  New
                </span>
              )}
              {product.collection && <Tag>{product.collection}</Tag>}
            </div>
          )}
          <LikeButton
            productId={product.id}
            label={product.name}
            className="absolute top-[1cqw] right-[1cqw] size-[2.6cqw] min-h-8 min-w-8 border border-[#e4e5e8] bg-white/90 shadow-sm"
          />
          <QuickAddButton
            productId={product.id}
            className="absolute bottom-[1cqw] right-[1cqw] size-[2.6cqw] min-h-8 min-w-8 rounded-full border border-[#e4e5e8] bg-white/90 shadow-sm"
          />
        </RevealImage>
      </Link>

      <div className="mt-[1cqw] flex items-center gap-[0.5cqw] text-[clamp(9px,0.75cqw,12px)] text-[#3aa15c]">
        <span className="size-[0.5cqw] min-h-1.5 min-w-1.5 rounded-full bg-[#3aa15c]" />
        {product.season}
      </div>

      <Link href={`/products/${product.id}`} className="mt-[0.3cqw] block">
        <p className="text-[clamp(12px,0.95cqw,15px)]">{product.name}</p>
        <p className="mt-[0.2cqw] text-[clamp(11px,0.85cqw,14px)] text-[#6b7078]">{formatPrice(product.price, product.currency)}</p>
      </Link>
    </article>
  );
}
