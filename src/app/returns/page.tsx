import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { Button } from "@/components/atoms/Button";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { ReturnRequestForm } from "@/components/molecules/ReturnRequestForm";
import { getOrderById } from "@/lib/data/orders";
import { getReturnRequestForOrder } from "@/lib/data/returns";
import { formatPrice } from "@/lib/utils";

const STEPS = [
  { step: "01", title: "Start your return", text: "Go to your account's order history and select the item you'd like to return, within 30 days of delivery." },
  { step: "02", title: "Pack it up", text: "Use the original packaging if you still have it, with tags attached and the item unworn." },
  { step: "03", title: "Drop it off", text: "Print the prepaid label we email you and drop the package at any carrier location." },
  { step: "04", title: "Get refunded", text: "Once it arrives at our warehouse, your refund is issued to the original payment method within 3–5 days." },
];

export default async function ReturnsPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = await searchParams;
  // getOrderById is RLS-scoped to the order's owner (or an admin) — a stray/foreign id just resolves to null.
  const order = orderId ? await getOrderById(orderId) : null;
  const existingRequest = order ? await getReturnRequestForOrder(order.id) : null;

  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />

      <Panel className="px-[3.4cqw] pt-[4.2cqw] pb-[3.4cqw]">
        <Eyebrow className="mb-[1.6cqw] text-[#8e939a]">Help Center</Eyebrow>
        <AnimatedHeading lines={["RETURNS &", "EXCHANGES"]} className="mb-[2cqw] text-[3.6cqw] leading-[0.95] font-medium tracking-[-0.04em]" />
        <Text className="max-w-[40cqw] max-md:max-w-none">
          Not the right fit? You have 30 days from delivery to send it back for a full refund or exchange — free on
          every domestic order.
        </Text>

        {order && (
          <div className="mt-[2cqw] rounded-[1.1cqw] bg-panel p-[1.8cqw]">
            <p className="text-[clamp(12px,1cqw,16px)] font-medium">
              Return order #{order.id.slice(0, 8).toUpperCase()} <span className="text-[#8e939a]">· {formatPrice(order.total, order.currency)}</span>
            </p>
            {existingRequest ? (
              <p className="mt-[0.8cqw] text-[clamp(12px,0.9cqw,14px)] text-[#6b7078]">
                Return request submitted on {new Date(existingRequest.createdAt).toLocaleDateString()} — status:{" "}
                <span className="font-medium capitalize text-ink">{existingRequest.status}</span>.
              </p>
            ) : (
              <ReturnRequestForm orderId={order.id} />
            )}
          </div>
        )}

        <div className="mt-[2.8cqw] grid gap-[1.6cqw] md:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.step} className="rounded-[1.1cqw] bg-panel p-[1.6cqw]">
              <p className="text-[clamp(16px,1.6cqw,26px)] font-semibold text-[#c9ccd1]">{s.step}</p>
              <p className="mt-[0.4cqw] text-[clamp(12px,1cqw,16px)] font-medium">{s.title}</p>
              <Text className="mt-[0.5cqw]">{s.text}</Text>
            </div>
          ))}
        </div>

        <div className="mt-[2.4cqw] rounded-[1.1cqw] bg-panel p-[1.8cqw]">
          <p className="text-[clamp(12px,1cqw,16px)] font-medium">Good to know</p>
          <ul className="mt-[0.8cqw] flex flex-col gap-[0.5cqw] text-[clamp(10px,0.88cqw,14px)] leading-[1.5] text-muted">
            <li>— Final sale and clearance items can't be returned or exchanged.</li>
            <li>— Swimwear and underwear must have the hygiene liner still attached.</li>
            <li>— Exchanges for a different size ship out as soon as we receive your return.</li>
            <li>— Gift returns are issued as store credit instead of a refund.</li>
          </ul>
        </div>

        <Button href="/contact" shape="square" className="mt-[2.4cqw]">NEED HELP WITH A RETURN?</Button>
      </Panel>

      <SiteFooter />
    </main>
  );
}
