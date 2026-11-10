import { Panel } from "@/components/atoms/Panel";

const CHIPS = ["Neutral Palette", "Office Ready", "Weekend Vibes", "Date Night", "Travel Essentials"];

/** Studio-only: a quiet decorative "style recommended for you" chip row, echoing the reference's recommend section. */
export function RecommendedChips() {
  return (
    <Panel className="px-[3.4cqw] py-[2cqw]">
      <h2 className="mb-[1.2cqw] text-[clamp(13px,1.3cqw,19px)] font-medium">
        STYLE <span className="font-normal text-muted">RECOMMENDED FOR YOU</span>
      </h2>
      <div className="flex flex-wrap gap-[0.9cqw]">
        {CHIPS.map((c, i) => (
          <span
            key={c}
            className={`rounded-[0.4cqw] border px-[1.2cqw] py-[0.5cqw] text-[clamp(9px,0.78cqw,12px)] ${
              i === 0 ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white" : "border-ghost text-muted"
            }`}
          >
            {c}
          </span>
        ))}
      </div>
    </Panel>
  );
}
