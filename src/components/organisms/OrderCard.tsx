import Image from "next/image";
import Link from "next/link";
import { BuyItAgainButton } from "@/components/molecules/BuyItAgainButton";
import { formatPrice } from "@/lib/utils";
import type { MyOrder } from "@/lib/data/orders";

const STATUS_COPY: Record<string, { label: string; sub: string }> = {
  placed: { label: "Order placed", sub: "We're preparing your order." },
  fulfilled: { label: "Delivered", sub: "Your package was delivered." },
  cancelled: { label: "Order cancelled", sub: "This order was cancelled." },
};

const RETURN_WINDOW_DAYS = 30;

export function OrderCard({ order }: { order: MyOrder }) {
  const placedDate = new Date(order.createdAt);
  const eligibleTill = new Date(placedDate.getTime() + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const canReturn = order.status !== "cancelled" && eligibleTill.getTime() > Date.now();
  const status = STATUS_COPY[order.status] ?? { label: order.status, sub: "" };

  return (
    <div className="overflow-hidden rounded-[14px] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-panel px-5 py-3 text-[12px]">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="tracking-wide text-[#8e939a]">ORDER PLACED</p>
            <p className="font-medium">{placedDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div>
            <p className="tracking-wide text-[#8e939a]">TOTAL</p>
            <p className="font-medium">{formatPrice(order.total, order.currency)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#8e939a]">ORDER # {order.id.slice(0, 8).toUpperCase()}</span>
          <Link href={`/orders/${order.id}`} className="font-medium text-ink underline hover:text-[#6b7078]">
            View order details
          </Link>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[16px] font-bold">{status.label}</p>
        {status.sub && <p className="text-[13px] text-[#6b7078]">{status.sub}</p>}

        <div className="mt-4 flex flex-col divide-y divide-[#eceef0]">
          {order.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-[8px] bg-panel">
                {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />}
              </div>

              <div className="flex-1">
                {item.productId ? (
                  <Link href={`/products/${item.productId}`} className="text-[14px] text-ink underline hover:text-[#6b7078]">
                    {item.name}
                  </Link>
                ) : (
                  <p className="text-[14px]">{item.name}</p>
                )}
                <p className="mt-1 text-[12px] text-[#8e939a]">
                  Qty {item.quantity}
                  {canReturn && ` · Return eligible till ${eligibleTill.toLocaleDateString()}`}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {item.productId && <BuyItAgainButton productId={item.productId} />}
                  {item.productId && (
                    <Link
                      href={`/products/${item.productId}`}
                      className="rounded-full border border-[#d8dade] px-4 py-1.5 text-[13px] transition-colors hover:border-ink"
                    >
                      View your item
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-row flex-wrap gap-2 sm:w-[170px] sm:flex-col">
                <Link
                  href={`/orders/${order.id}`}
                  className="rounded-full border border-[#d8dade] px-4 py-1.5 text-center text-[13px] transition-colors hover:border-ink"
                >
                  Track package
                </Link>
                <Link
                  href="/returns"
                  className="rounded-full border border-[#d8dade] px-4 py-1.5 text-center text-[13px] transition-colors hover:border-ink"
                >
                  Return items
                </Link>
                {item.productId && (
                  <Link
                    href={`/products/${item.productId}`}
                    className="rounded-full border border-[#d8dade] px-4 py-1.5 text-center text-[13px] transition-colors hover:border-ink"
                  >
                    Write a review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
