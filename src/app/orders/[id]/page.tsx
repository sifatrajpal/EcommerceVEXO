import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/atoms/Panel";
import { Button } from "@/components/atoms/Button";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { OrderTracker } from "@/components/molecules/OrderTracker";
import { getOrderById } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr] gap-2.5 p-2.5">
      <SiteHeaderBar />
      <Panel className="mx-auto w-full max-w-[480px] self-center p-[3cqw]">
        <p className="text-[13px] font-medium tracking-[0.04em] text-[#3aa15c]">ORDER PLACED</p>
        <h1 className="mt-1 text-2xl font-medium">Thanks for your order</h1>
        <p className="mt-1 text-[13px] text-[#8e939a]">
          Confirmation #{order.id.slice(0, 8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}
        </p>

        <OrderTracker status={order.status} />

        <div className="mt-6 flex flex-col divide-y divide-[#eceef0]">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-[14px]">
              <span>
                {item.name} <span className="text-[#8e939a]">× {item.quantity}</span>
              </span>
              <span>{formatPrice(item.price * item.quantity, order.currency)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#eceef0] pt-3 text-[16px] font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total, order.currency)}</span>
        </div>

        <Button href="/" className="mt-6 w-full">CONTINUE SHOPPING</Button>
        <Link href="/cart" className="mt-3 block text-center text-[13px] text-[#8e939a] hover:text-ink">View bag</Link>
      </Panel>
    </main>
  );
}
