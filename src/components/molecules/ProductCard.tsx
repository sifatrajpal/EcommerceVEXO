import Link from "next/link";
import { RevealImage } from "@/components/atoms/RevealImage";
import { HeartButton } from "@/components/atoms/HeartButton";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

const SWATCHES = ["#e4d9c6", "#ffffff", "#b3542f", "#141414"];

type Props = {
  product: Product;
  delay?: number;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
};

export function ProductCard({ product, delay = 0, className, imageClassName = "aspect-[203/279]", objectPosition }: Props) {
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
          <HeartButton
            label={product.name}
            className="absolute top-[1cqw] right-[1cqw] size-[2.6cqw] min-h-8 min-w-8 border border-[#e4e5e8] bg-white/90 shadow-sm"
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

      <div className="mt-[0.7cqw] flex gap-[0.5cqw]">
        {SWATCHES.map((color) => (
          <span key={color} className="size-[1cqw] min-h-3.5 min-w-3.5 rounded-full border border-[#e4e5e8]" style={{ backgroundColor: color }} />
        ))}
      </div>
    </article>
  );
}
