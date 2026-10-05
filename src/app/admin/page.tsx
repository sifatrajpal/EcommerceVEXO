import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { isCurrentUserAdmin } from "@/lib/admin";
import { getAdminStats, getRecentOrders, getTopProducts, getCartActivity, getSubscriberCount } from "@/lib/data/admin-stats";
import { getProductCount } from "@/lib/data/queries";
import { formatPrice } from "@/lib/utils";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) notFound();

  const [stats, recentOrders, topProducts, cartActivity, subscriberCount, productCount] = await Promise.all([
    getAdminStats(),
    getRecentOrders(10),
    getTopProducts(5),
    getCartActivity(),
    getSubscriberCount(),
    getProductCount(),
  ]);

  const cards = [
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue, "USD") },
    { label: "Total Orders", value: String(stats.totalOrders) },
    { label: "Customers", value: String(stats.distinctCustomers) },
    { label: "Avg Order Value", value: formatPrice(stats.avgOrderValue, "USD") },
    { label: "Products Listed", value: String(productCount) },
    { label: "Newsletter Subscribers", value: String(subscriberCount) },
    { label: "Active Carts", value: String(cartActivity.activeCarts) },
    { label: "Items Sitting in Carts", value: String(cartActivity.itemsInCarts) },
  ];

  return (
    <div className="rounded-[22px] bg-panel px-6 py-8 md:px-10 md:py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">ADMIN</h1>
        <p className="mt-1 text-[13px] text-[#8e939a]">Signed in as {user.email}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-[14px] bg-white p-5">
              <p className="text-[13px] text-[#8e939a]">{c.label}</p>
              <p className="mt-1 text-2xl font-semibold">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-3 text-lg font-semibold">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="rounded-[14px] bg-white p-6 text-center text-[#8e939a]">No orders placed yet.</p>
            ) : (
              <div className="overflow-hidden rounded-[14px] bg-white">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-[#eceef0] text-[#8e939a]">
                      <th className="px-5 py-3 font-medium">Order</th>
                      <th className="px-5 py-3 font-medium">Customer</th>
                      <th className="px-5 py-3 font-medium">Items</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="border-b border-[#eceef0] last:border-0">
                        <td className="px-5 py-3">
                          <Link href={`/orders/${o.id}`} className="underline hover:text-[#6b7078]">
                            #{o.id.slice(0, 8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-5 py-3">{o.userEmail}</td>
                        <td className="px-5 py-3">{o.itemCount}</td>
                        <td className="px-5 py-3 text-[#8e939a]">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3 text-right font-medium">{formatPrice(o.total, o.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Top Products</h2>
            {topProducts.length === 0 ? (
              <p className="rounded-[14px] bg-white p-6 text-center text-[#8e939a]">No sales yet.</p>
            ) : (
              <div className="flex flex-col gap-2 rounded-[14px] bg-white p-2">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-[14px]">
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-[#8e939a]">{i + 1}.</span>
                      <span className="truncate">{p.name}</span>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-medium">{p.unitsSold} sold</p>
                      <p className="text-[12px] text-[#8e939a]">{formatPrice(p.revenue, "USD")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
