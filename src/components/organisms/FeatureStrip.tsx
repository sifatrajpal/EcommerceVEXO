import { Panel } from "@/components/atoms/Panel";
import { LeafIcon, ShieldCheckIcon, CardIcon, HeadsetIcon } from "@/components/atoms/Icons";

const FEATURES = [
  { Icon: LeafIcon, title: "SUSTAINABLE FABRICS", body: "Thoughtful choices for a better tomorrow." },
  { Icon: ShieldCheckIcon, title: "PREMIUM QUALITY", body: "Crafted with care, made to last." },
  { Icon: CardIcon, title: "SECURE PAYMENTS", body: "Safe, simple and hassle-free." },
  { Icon: HeadsetIcon, title: "CUSTOMER CARE", body: "We're here for you, always." },
];

/** Studio-only: a quiet 4-up reassurance row, echoing the reference's icon-features band. */
export function FeatureStrip() {
  return (
    <Panel className="grid grid-cols-2 gap-x-[2.2cqw] gap-y-[2.2cqw] px-[3.4cqw] py-[2.6cqw] md:grid-cols-4">
      {FEATURES.map(({ Icon, title, body }) => (
        <div key={title} className="flex items-start gap-[1cqw]">
          <Icon className="size-[2.4cqw] min-h-6 min-w-6 shrink-0 text-muted" />
          <div>
            <h4 className="mb-[0.4cqw] text-[clamp(10px,0.82cqw,13px)] font-medium tracking-[0.02em]">{title}</h4>
            <p className="text-[clamp(9px,0.75cqw,12px)] leading-[1.4] text-muted">{body}</p>
          </div>
        </div>
      ))}
    </Panel>
  );
}
