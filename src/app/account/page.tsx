import Link from "next/link";
import { redirect } from "next/navigation";
import { Panel } from "@/components/atoms/Panel";
import { Button } from "@/components/atoms/Button";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { getMyOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const orders = await getMyOrders();

  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />

      <Panel className="px-[3.4cqw] pt-[3.4cqw] pb-[3.4cqw]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[clamp(9px,0.78cqw,12px)] font-medium tracking-[0.04em] text-[#8e939a]">MY ACCOUNT</p>
            <h1 className="mt-[0.4cqw] text-[clamp(22px,2.6cqw,36px)] font-medium tracking-[-0.02em]">{user.email}</h1>
            <p className="mt-[0.3cqw] text-[clamp(11px,0.85cqw,14px)] text-[#8e939a]">
              Member since {new Date(user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Button href="/shop" shape="pill" className="!px-[1.8cqw] !py-[1.1cqw]">CONTINUE SHOPPING</Button>
        </div>

        <div className="mt-[2.8cqw]">
          <h2 className="mb-[1.2cqw] text-[clamp(14px,1.2cqw,18px)] font-semibold">Order History</h2>

          {orders.length === 0 ? (
            <div className="rounded-[1.1cqw] bg-panel p-[2.4cqw] text-center">
              <p className="text-[clamp(11px,0.9cqw,15px)] text-[#6b7078]">You haven&apos;t placed an order yet.</p>
              <Button href="/shop" className="mx-auto mt-[1.2cqw] w-fit">START SHOPPING</Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[1.1cqw] bg-panel">
              <table className="w-full text-left text-[clamp(11px,0.9cqw,15px)]">
                <thead>
                  <tr className="border-b border-[#d8dade] text-[#6b7078]">
                    <th className="px-[1.6cqw] py-[1.1cqw] font-medium">Order</th>
                    <th className="px-[1.6cqw] py-[1.1cqw] font-medium">Date</th>
                    <th className="px-[1.6cqw] py-[1.1cqw] font-medium">Items</th>
                    <th className="px-[1.6cqw] py-[1.1cqw] font-medium">Status</th>
                    <th className="px-[1.6cqw] py-[1.1cqw] text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-[#d8dade] last:border-0">
                      <td className="px-[1.6cqw] py-[1.1cqw]">
                        <Link href={`/orders/${o.id}`} className="underline hover:text-[#6b7078]">
                          #{o.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-[1.6cqw] py-[1.1cqw] text-[#6b7078]">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-[1.6cqw] py-[1.1cqw]">{o.itemCount}</td>
                      <td className="px-[1.6cqw] py-[1.1cqw] capitalize text-[#6b7078]">{o.status}</td>
                      <td className="px-[1.6cqw] py-[1.1cqw] text-right font-medium">{formatPrice(o.total, o.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Panel>
    </main>
  );
}
