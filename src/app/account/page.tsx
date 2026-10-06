import { redirect } from "next/navigation";
import { Panel } from "@/components/atoms/Panel";
import { Button } from "@/components/atoms/Button";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { OrderCard } from "@/components/organisms/OrderCard";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { getMyOrdersWithItems } from "@/lib/data/orders";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const orders = await getMyOrdersWithItems();

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
            <div className="flex flex-col gap-[1.2cqw]">
              {orders.map((o) => (
                <OrderCard key={o.id} order={o} />
              ))}
            </div>
          )}
        </div>
      </Panel>
    </main>
  );
}
