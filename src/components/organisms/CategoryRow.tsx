import Link from "next/link";
import { Panel } from "@/components/atoms/Panel";
import { RevealImage } from "@/components/atoms/RevealImage";

const CATEGORIES = [
  { label: "Dresses", image: "/images/arrival-1.png" },
  { label: "Tops", image: "/images/arrival-2.png" },
  { label: "Bottoms", image: "/images/arrival-3.png" },
  { label: "Bags", image: "/images/arrival-5.png" },
  { label: "Accessories", image: "/images/arrival-6.png" },
  { label: "Blazers", image: "/images/arrival-7.png" },
  { label: "Shoes", image: "/images/arrival-8.png" },
];

/** Élanora-only circular category nav, echoing the reference design's browse-by-category row. */
export function CategoryRow() {
  return (
    <Panel className="flex flex-wrap justify-center gap-[2.4cqw] px-[2.6cqw] py-[2.6cqw] max-sm:gap-[4.4cqw]">
      {CATEGORIES.map((c, i) => (
        <Link
          key={c.label}
          href="/shop"
          className="flex w-[9.5cqw] min-w-24 flex-col items-center gap-[1.1cqw] text-center text-[clamp(10px,0.9cqw,14px)]"
        >
          <RevealImage
            src={c.image}
            alt={c.label}
            delay={i * 0.06}
            sizes="10vw"
            className="relative aspect-square w-full rounded-full"
            imgClassName="object-top"
          />
          {c.label}
        </Link>
      ))}
    </Panel>
  );
}
