"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDownIcon, StarIcon } from "@/components/atoms/Icons";
import { submitReview, type ReviewFormState } from "@/actions/reviews";
import type { Review } from "@/lib/data/reviews";

const CARE_AND_DETAILS = [
  "Breathable cotton-poly blend with four-way stretch.",
  "Relaxed fit — true to size.",
  "Machine wash cold, tumble dry low.",
  "Do not bleach or dry clean.",
  "Designed in-house, ethically manufactured.",
];

function Row({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#e4e5e8]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-[1cqw] py-[1.4cqw] text-left"
      >
        <span className="text-[clamp(15px,1.3cqw,20px)] font-bold">{title}</span>
        <ChevronDownIcon className={`size-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-[1.6cqw] text-[clamp(11px,0.95cqw,15px)] leading-[1.6] text-ink">{children}</div>}
    </div>
  );
}

const reviewFormInitial: ReviewFormState = { status: "idle" };

function ReviewForm({ productId, onDone }: { productId: string; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(submitReview, reviewFormInitial);
  const [rating, setRating] = useState(5);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
    setRating(5);
    const timer = setTimeout(onDone, 1400);
    return () => clearTimeout(timer);
  }, [state, onDone]);

  return (
    <form ref={formRef} action={formAction} className="mb-[1.6cqw] rounded-[1cqw] border border-[#e4e5e8] p-[1.4cqw]">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <p className="mb-[0.6cqw] text-[13px] font-medium">Your rating</p>
      <div className="mb-[1cqw] flex gap-[0.4cqw] text-[#f5a623]">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star${n === 1 ? "" : "s"}`}>
            <StarIcon filled={n <= rating} className="size-6" />
          </button>
        ))}
      </div>

      <input
        name="name"
        required
        placeholder="Your name"
        className="w-full rounded-md border border-[#d8dade] px-3 py-2 text-[14px] outline-none focus:border-ink"
      />
      <textarea
        name="comment"
        required
        rows={3}
        placeholder="Tell us what you thought…"
        className="mt-[0.8cqw] w-full resize-none rounded-md border border-[#d8dade] px-3 py-2 text-[14px] outline-none focus:border-ink"
      />

      {state.status === "error" && <p className="mt-[0.6cqw] text-[13px] text-[#c23434]">{state.message}</p>}
      {state.status === "success" && <p className="mt-[0.6cqw] text-[13px] text-[#3aa15c]">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-[1cqw] rounded-md bg-[#141414] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

function ReviewsRow({ productId, reviews, average, count }: { productId: string; reviews: Review[]; average: number; count: number }) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="border-b border-[#e4e5e8]">
      <div className="flex items-center justify-between gap-[1cqw] py-[1.4cqw]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex flex-1 items-center gap-[0.5cqw] text-left"
        >
          <span className="text-[clamp(15px,1.3cqw,20px)] font-bold">Reviews</span>
          {count > 0 && <span className="text-[clamp(12px,1cqw,16px)] text-[#8e939a]">({count})</span>}
        </button>

        <span className="flex items-center gap-[1cqw]">
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setShowForm((s) => !s);
            }}
            className="group inline-flex items-center gap-2 rounded-md border border-ink px-[1.4cqw] py-[0.7cqw] text-[clamp(11px,0.85cqw,13px)] font-semibold transition-colors hover:bg-ink hover:text-white"
          >
            Write a review
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle Reviews"
            className="grid place-items-center"
          >
            <ChevronDownIcon className={`size-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>
        </span>
      </div>

      {open && (
        <div className="pb-[1.6cqw] text-[clamp(11px,0.95cqw,15px)] leading-[1.6] text-ink">
          <div className="mb-[1.2cqw] flex flex-wrap items-center justify-between gap-[0.8cqw]">
            <p className="text-[clamp(13px,1.1cqw,18px)] font-bold">What customers say</p>
            {count > 0 && (
              <div className="flex items-center gap-[0.5cqw]">
                <div className="flex text-[#f5a623]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i < Math.round(average)} className="size-4" />
                  ))}
                </div>
                <span className="text-[13px] font-medium">
                  {average.toFixed(1)} · {count} rating{count === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>

          {showForm && <ReviewForm productId={productId} onDone={() => setShowForm(false)} />}

          {reviews.length === 0 ? (
            <p className="text-[#8e939a]">No reviews yet — be the first to share your thoughts.</p>
          ) : (
            <div className="flex flex-col gap-[1.2cqw]">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-[1cqw] bg-panel p-[1.4cqw]">
                  <div className="flex items-center gap-[0.3cqw] text-[#f5a623]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} filled={i < r.rating} className="size-3.5" />
                    ))}
                  </div>
                  <p className="mt-[0.6cqw] text-[#3f4248]">{r.comment}</p>
                  <p className="mt-[0.6cqw] text-[12px] font-medium text-[#8e939a]">{r.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type Props = {
  productId: string;
  description: string;
  brand?: string | null;
  material?: string | null;
  reviews: Review[];
  ratingAverage: number;
  ratingCount: number;
};

export function ProductAccordion({ productId, description, brand, material, reviews, ratingAverage, ratingCount }: Props) {
  const details = [
    ...(brand ? [`Brand: ${brand}`] : []),
    ...(material ? [`Material: ${material}`] : []),
    ...CARE_AND_DETAILS,
  ];

  return (
    <div className="mt-[2.8cqw] border-t border-[#e4e5e8]">
      <ReviewsRow productId={productId} reviews={reviews} average={ratingAverage} count={ratingCount} />

      <Row title="Size and fit">
        <p>
          This item fits true to size — we recommend ordering your usual size for a relaxed, everyday fit, or sizing
          down for something more fitted.
        </p>
        <a href="/size-guide" className="group mt-[0.8cqw] inline-flex items-center gap-1 font-semibold text-ink">
          See full size guide
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </Row>

      <Row title="Description">
        <p>{description}</p>
      </Row>

      <Row title="Details">
        <ul className="flex flex-col gap-[0.5cqw]">
          {details.map((line) => (
            <li key={line} className="flex gap-[0.6cqw]">
              <span className="text-[#8e939a]">—</span>
              {line}
            </li>
          ))}
        </ul>
      </Row>
    </div>
  );
}
