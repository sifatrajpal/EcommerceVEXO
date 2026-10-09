import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

const OPTIONS = [
  { name: "Standard", time: "5–7 business days", price: "$6.00", note: `Free on orders over $${FREE_SHIPPING_THRESHOLD}` },
  { name: "Express", time: "2–3 business days", price: "$14.00", note: "Order by 2pm EST to ship same day" },
  { name: "Overnight", time: "1 business day", price: "$28.00", note: "Available for US addresses only" },
  { name: "International", time: "7–14 business days", price: "$24.00", note: "Duties and taxes calculated at checkout" },
];

export default function ShippingPage() {
  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />

      <Panel className="px-[3.4cqw] pt-[4.2cqw] pb-[3.4cqw]">
        <Eyebrow className="mb-[1.6cqw] text-[#8e939a]">Help Center</Eyebrow>
        <AnimatedHeading lines={["SHIPPING", "INFORMATION"]} className="mb-[2cqw] text-[3.6cqw] leading-[0.95] font-medium tracking-[-0.04em]" />
        <Text className="max-w-[40cqw] max-md:max-w-none">
          Every order ships from our Brooklyn warehouse within 1 business day. Once it's on the move, you'll get a
          tracking link by email so you always know where your gear is.
        </Text>

        <div className="mt-[2.8cqw] overflow-hidden rounded-[1.1cqw] bg-panel">
          <table className="w-full text-left text-[clamp(11px,0.9cqw,15px)]">
            <thead>
              <tr className="border-b border-[#d8dade] text-[#6b7078]">
                <th className="px-[1.6cqw] py-[1.2cqw] font-medium">Method</th>
                <th className="px-[1.6cqw] py-[1.2cqw] font-medium">Delivery Time</th>
                <th className="px-[1.6cqw] py-[1.2cqw] font-medium">Cost</th>
                <th className="px-[1.6cqw] py-[1.2cqw] font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {OPTIONS.map((o) => (
                <tr key={o.name} className="border-b border-[#d8dade] last:border-0">
                  <td className="px-[1.6cqw] py-[1.2cqw] font-medium">{o.name}</td>
                  <td className="px-[1.6cqw] py-[1.2cqw]">{o.time}</td>
                  <td className="px-[1.6cqw] py-[1.2cqw]">{o.price}</td>
                  <td className="px-[1.6cqw] py-[1.2cqw] text-[#6b7078]">{o.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-[2.4cqw] grid gap-[1.6cqw] md:grid-cols-3">
          <div className="rounded-[1.1cqw] bg-panel p-[1.6cqw]">
            <p className="text-[clamp(12px,1cqw,16px)] font-medium">Order tracking</p>
            <Text className="mt-[0.5cqw]">A tracking number lands in your inbox the moment your order ships — no account required.</Text>
          </div>
          <div className="rounded-[1.1cqw] bg-panel p-[1.6cqw]">
            <p className="text-[clamp(12px,1cqw,16px)] font-medium">Address changes</p>
            <Text className="mt-[0.5cqw]">Contact us within 1 hour of placing your order and we'll do our best to update the address.</Text>
          </div>
          <div className="rounded-[1.1cqw] bg-panel p-[1.6cqw]">
            <p className="text-[clamp(12px,1cqw,16px)] font-medium">Lost or delayed</p>
            <Text className="mt-[0.5cqw]">Reach out to our team and we'll track it down or send a replacement, no questions asked.</Text>
          </div>
        </div>
      </Panel>

      <SiteFooter />
    </main>
  );
}
