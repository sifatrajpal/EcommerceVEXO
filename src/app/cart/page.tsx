import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Panel } from "@/components/atoms/Panel";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { BagIcon, ArrowUpRightIcon } from "@/components/atoms/Icons";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { getCartItems } from "@/lib/data/cart";
import { getActiveCouponByCode } from "@/lib/data/coupons";
import { updateCartQuantity, removeFromCart, clearCart } from "@/actions/cart";
import { placeOrder } from "@/actions/checkout";
import { removeCoupon } from "@/actions/coupons";
import { CouponForm } from "@/components/molecules/CouponForm";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { computeDiscount, COUPON_COOKIE } from "@/lib/pricing";
import { formatPrice, DELIVERY_FEE, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

export default async function CartPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const items = await getCartItems();
  const itemCount = items.reduce((n, item) => n + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const fee = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE;
  const currency = items[0]?.product.currency ?? "USD";
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const jar = await cookies();
  const couponCode = jar.get(COUPON_COOKIE)?.value ?? null;
  const coupon = couponCode ? await getActiveCouponByCode(couponCode) : null;
  const discount = coupon ? computeDiscount(subtotal, coupon) : 0;
  const total = Math.max(0, subtotal + fee - discount);

  return (
    <main className="grid min-h-screen gap-2.5 bg-frame p-2.5">
      <SiteHeaderBar />
      <Panel className="px-6 py-8 md:px-10 md:py-10">
        <p className="text-[13px] text-[#8e939a]">
          <Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">Shopping Bag</span>
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">SHOPPING BAG</h1>
          {items.length > 0 && (
            <form action={clearCart}>
              <button type="submit" className="text-[13px] text-[#8e939a] underline hover:text-ink">Remove All</button>
            </form>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Text>Your bag is empty.</Text>
            <Button href="/#new-arrivals" className="mx-auto mt-4 w-fit">SHOP NEW ARRIVALS</Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="flex flex-col divide-y divide-[#e4e5e8]">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 py-6 first:pt-0">
                  <div className="relative h-[140px] w-[110px] shrink-0 overflow-hidden rounded-[10px] bg-white">
                    <Image src={item.product.imageUrl} alt={item.product.name} fill sizes="110px" className="object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <Link href={`/products/${item.product.id}`} className="text-[15px] underline underline-offset-2 hover:text-[#6b7078]">
                      {item.product.name}
                    </Link>

                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        <form action={updateCartQuantity} className="mt-3 flex items-center gap-2">
                          <input type="hidden" name="itemId" value={item.id} />
                          <button type="submit" name="quantity" value={item.quantity - 1} aria-label="Decrease quantity" className="grid size-8 place-items-center rounded-md border border-[#d8dade] bg-white">−</button>
                          <span className="grid size-8 place-items-center rounded-md bg-white text-[14px]">{item.quantity}</span>
                          <button type="submit" name="quantity" value={item.quantity + 1} aria-label="Increase quantity" className="grid size-8 place-items-center rounded-md border border-[#d8dade] bg-white">
                            +
                          </button>
                        </form>
                        <form action={removeFromCart}>
                          <input type="hidden" name="itemId" value={item.id} />
                          <button type="submit" className="mt-3 text-[13px] text-[#c23434] hover:underline">Remove Item</button>
                        </form>
                      </div>

                      <p className="text-[17px] font-medium">{formatPrice(item.product.price * item.quantity, item.product.currency)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-[16px] bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Checkout</h2>
                <BagIcon className="size-5" />
              </div>

              <div className="mt-5 flex flex-col gap-3 text-[14px]">
                <div className="flex justify-between text-[#6b7078]">
                  <span>Number of items</span><span className="text-ink">{itemCount}</span>
                </div>
                <div className="flex justify-between text-[#6b7078]">
                  <span>Subtotal</span><span className="text-ink">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-[#6b7078]">
                  <span>Delivery Fee</span>
                  <span className="text-ink">{fee === 0 ? "FREE" : formatPrice(fee, currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#6b7078]">
                    <span>Discount {coupon && `(${coupon.code})`}</span>
                    <span className="text-[#3aa15c]">− {formatPrice(discount, currency)}</span>
                  </div>
                )}
                {amountToFreeShipping > 0 && (
                  <p className="text-[12px] text-[#8e939a]">
                    Add {formatPrice(amountToFreeShipping, currency)} more for free shipping.
                  </p>
                )}
                <div className="mt-2 flex justify-between border-t border-[#e4e5e8] pt-3 text-[16px] font-semibold">
                  <span>Total</span><span>{formatPrice(total, currency)}</span>
                </div>
              </div>

              <form action={placeOrder}>
                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-between rounded-lg bg-[#141414] px-4 py-3 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                  Make Payment
                  <ArrowUpRightIcon className="size-4" />
                </button>
              </form>

              {coupon ? (
                <div className="mt-6 flex items-center justify-between rounded-[12px] bg-panel p-4">
                  <div>
                    <p className="text-[13px] font-medium">Coupon &quot;{coupon.code}&quot; applied</p>
                    <p className="text-[12px] text-[#3aa15c]">− {formatPrice(discount, currency)}</p>
                  </div>
                  <form action={removeCoupon}>
                    <button type="submit" className="text-[12px] text-[#8e939a] underline hover:text-ink">Remove</button>
                  </form>
                </div>
              ) : (
                <div className="mt-6 rounded-[12px] bg-panel p-4">
                  <p className="mb-2 text-[13px] font-medium">Add Coupon Code</p>
                  <CouponForm />
                </div>
              )}
            </aside>
          </div>
        )}
      </Panel>
    </main>
  );
}
