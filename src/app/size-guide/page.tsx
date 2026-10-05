import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SiteFooter } from "@/components/organisms/SiteFooter";

const WOMEN = [
  { size: "XS", chest: "31–32", waist: "24–25", hip: "34–35" },
  { size: "S", chest: "33–34", waist: "26–27", hip: "36–37" },
  { size: "M", chest: "35–36", waist: "28–29", hip: "38–39" },
  { size: "L", chest: "37–39", waist: "30–32", hip: "40–42" },
  { size: "XL", chest: "40–42", waist: "33–35", hip: "43–45" },
];

const MEN = [
  { size: "S", chest: "35–37", waist: "29–31", hip: "35–37" },
  { size: "M", chest: "38–40", waist: "32–34", hip: "38–40" },
  { size: "L", chest: "41–43", waist: "35–37", hip: "41–43" },
  { size: "XL", chest: "44–46", waist: "38–40", hip: "44–46" },
  { size: "XXL", chest: "47–49", waist: "41–43", hip: "47–49" },
];

function SizeTable({ title, rows }: { title: string; rows: typeof WOMEN }) {
  return (
    <div className="overflow-hidden rounded-[1.1cqw] bg-panel">
      <p className="px-[1.6cqw] py-[1.2cqw] text-[clamp(12px,1cqw,16px)] font-medium">{title}</p>
      <table className="w-full text-left text-[clamp(11px,0.9cqw,15px)]">
        <thead>
          <tr className="border-y border-[#d8dade] text-[#6b7078]">
            <th className="px-[1.6cqw] py-[1cqw] font-medium">Size</th>
            <th className="px-[1.6cqw] py-[1cqw] font-medium">Chest (in)</th>
            <th className="px-[1.6cqw] py-[1cqw] font-medium">Waist (in)</th>
            <th className="px-[1.6cqw] py-[1cqw] font-medium">Hip (in)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.size} className="border-b border-[#d8dade] last:border-0">
              <td className="px-[1.6cqw] py-[1cqw] font-medium">{r.size}</td>
              <td className="px-[1.6cqw] py-[1cqw]">{r.chest}</td>
              <td className="px-[1.6cqw] py-[1cqw]">{r.waist}</td>
              <td className="px-[1.6cqw] py-[1cqw]">{r.hip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />

      <Panel className="px-[3.4cqw] pt-[4.2cqw] pb-[3.4cqw]">
        <Eyebrow className="mb-[1.6cqw] text-[#8e939a]">Help Center</Eyebrow>
        <AnimatedHeading lines={["FIND YOUR", "PERFECT FIT"]} className="mb-[2cqw] text-[3.6cqw] leading-[0.95] font-medium tracking-[-0.04em]" />
        <Text className="max-w-[40cqw] max-md:max-w-none">
          All measurements are in inches, taken directly on the body. If you're between two sizes, we recommend
          sizing up for a relaxed fit or sizing down for a compression fit.
        </Text>

        <div className="mt-[2.8cqw] grid gap-[1.8cqw] md:grid-cols-2">
          <SizeTable title="Women's" rows={WOMEN} />
          <SizeTable title="Men's" rows={MEN} />
        </div>

        <div className="mt-[2.4cqw] rounded-[1.1cqw] bg-panel p-[1.8cqw]">
          <p className="text-[clamp(12px,1cqw,16px)] font-medium">How to measure</p>
          <ul className="mt-[0.8cqw] flex flex-col gap-[0.5cqw] text-[clamp(10px,0.88cqw,14px)] leading-[1.5] text-muted">
            <li>— Chest: wrap the tape around the fullest part of your chest, under your arms.</li>
            <li>— Waist: measure around your natural waistline, keeping the tape snug but not tight.</li>
            <li>— Hip: measure around the fullest part of your hips, roughly 8 inches below your waist.</li>
          </ul>
        </div>
      </Panel>

      <SiteFooter />
    </main>
  );
}
