import Image from "next/image";
import Link from "next/link";
import { BagIcon } from "@/components/atoms/Icons";
import { BuyItAgainButton } from "@/components/molecules/BuyItAgainButton";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_COPY } from "@/lib/orderStatus";
import type { MyOrder } from "@/lib/data/orders";

const RETURN_WINDOW_DAYS = 30;

export function OrderCard({ order }: { order: MyOrder }) {
  const placedDate = new Date(order.createdAt);
  const eligibleTill = new Date(placedDate.getTime() + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const canReturn = order.status !== "cancelled" && eligibleTill.getTime() > Date.now();
  const status = ORDER_STATUS_COPY[order.status as keyof typeof ORDER_STATUS_COPY] ?? { label: order.status, sub: "" };

  return (
    <div className="overflow-hidden rounded-[14px] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-panel px-5 py-4 text-[13px]">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="tracking-wide text-[#6b7078]">ORDER PLACED</p>
            <p className="mt-0.5 text-[15px] font-semibold text-ink">
              {placedDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div>
            <p className="tracking-wide text-[#6b7078]">TOTAL</p>
            <p className="mt-0.5 text-[15px] font-semibold text-ink">{formatPrice(order.total, order.currency)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#6b7078]">ORDER # {order.id.slice(0, 8).toUpperCase()}</span>
          <Link href={`/orders/${order.id}`} className="font-semibold text-ink underline hover:text-[#6b7078]">
            View order details
          </Link>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[20px] font-bold text-ink">{status.label}</p>
        {status.sub && <p className="mt-0.5 text-[14px] text-[#6b7078]">{status.sub}</p>}

        <div className="mt-4 flex flex-col divide-y divide-[#eceef0]">
          {order.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-[8px] border border-[#eceef0] bg-panel">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover object-top" />
                ) : (
                  <span className="grid size-full place-items-center text-[#b9bec4]">
                    <BagIcon className="size-7" />
                  </span>
                )}
              </div>

              <div className="flex-1">
                {item.productId ? (
                  <Link href={`/products/${item.productId}`} className="text-[16px] font-medium text-ink underline hover:text-[#6b7078]">
                    {item.name}
                  </Link>
                ) : (
                  <p className="text-[16px] font-medium text-ink">{item.name}</p>
                )}
                <p className="mt-1 text-[13px] text-[#6b7078]">
                  Qty {item.quantity}
                  {canReturn && ` · Return eligible till ${eligibleTill.toLocaleDateString()}`}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-2">
                  {item.productId && <BuyItAgainButton productId={item.productId} />}
                  {item.productId && (
                    <Link
                      href={`/products/${item.productId}`}
                      className="rounded-full border border-[#d8dade] px-4 py-2 text-[14px] font-medium transition-colors hover:border-ink"
                    >
                      View your item
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-row flex-wrap gap-2 sm:w-[180px] sm:flex-col">
                <Link
                  href={`/orders/${order.id}`}
                  className="rounded-full border border-[#d8dade] px-4 py-2 text-center text-[14px] font-medium transition-colors hover:border-ink"
                >
                  Track package
                </Link>
                <Link
                  href={`/returns?orderId=${order.id}`}
                  className="rounded-full border border-[#d8dade] px-4 py-2 text-center text-[14px] font-medium transition-colors hover:border-ink"
                >
                  Return items
                </Link>
                {item.productId && (
                  <Link
                    href={`/products/${item.productId}`}
                    className="rounded-full border border-[#d8dade] px-4 py-2 text-center text-[14px] font-medium transition-colors hover:border-ink"
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
