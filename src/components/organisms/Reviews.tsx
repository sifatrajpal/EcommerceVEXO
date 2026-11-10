import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { StarIcon } from "@/components/atoms/Icons";

const REVIEWS = [
  {
    quote: "The quality is incredible and the styles are so timeless. ÉLANORA is my go-to for everything!",
    name: "Sophia L.",
  },
  {
    quote: "Beautiful pieces, fast shipping and amazing customer service. Highly recommend!",
    name: "Jessica M.",
  },
  {
    quote: "I feel so confident in everything I've ordered. Worth every penny.",
    name: "Ava T.",
  },
];

/** Élanora-only testimonial grid, echoing the reference design's "What Our Customers Say" section. */
export function Reviews() {
  return (
    <Panel className="grid gap-[2.6cqw] px-[4.1cqw] py-[4.4cqw] md:grid-cols-[22%_1fr]">
      <div className="flex flex-col pt-[0.4cqw]">
        <AnimatedHeading
          lines={["What Our", "Customers Say"]}
          className="text-[2.5cqw] leading-[1.15] font-medium"
        />
        <Text className="mt-[1.4cqw] max-w-[85%]">Real words from the women who wear ÉLANORA every day.</Text>
      </div>

      <div className="grid gap-[1.6cqw] sm:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure key={r.name} className="flex flex-col rounded-[var(--radius-panel)] bg-frame px-[1.8cqw] py-[2.2cqw]">
            <div aria-hidden className="h-[2.4cqw] min-h-6 text-[3.6cqw] leading-none text-ghost">&ldquo;</div>
            <div className="mt-[0.4cqw] flex gap-[0.2cqw] text-[#a88b6c]">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} filled className="size-[1.1cqw] min-h-3 min-w-3" />
              ))}
            </div>
            <blockquote className="mt-[1cqw] flex-1 text-[clamp(13px,1.1cqw,17px)] leading-[1.5]">{r.quote}</blockquote>
            <figcaption className="mt-[1.6cqw] flex items-center gap-[0.7cqw] border-t border-ghost pt-[1.2cqw]">
              <span className="grid size-[2.4cqw] min-h-9 min-w-9 place-items-center rounded-full bg-panel text-[clamp(10px,0.85cqw,13px)] font-medium">
                {r.name[0]}
              </span>
              <span className="flex flex-col">
                <Eyebrow className="font-medium tracking-normal">{r.name}</Eyebrow>
                <span className="text-[clamp(9px,0.75cqw,12px)] text-muted">Verified buyer</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Panel>
  );
}
