import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import {
  getAdminStats,
  getRecentOrders,
  getTopProducts,
  getCartActivity,
  getSubscriberCount,
  getRevenueTrend,
  getOrdersByStatus,
} from "@/lib/data/admin-stats";
import { getProductCount } from "@/lib/data/queries";
import { formatPrice } from "@/lib/utils";
import { TrendingUpIcon, BagIcon, UsersIcon, BoxIcon } from "@/components/atoms/Icons";
import { RevenueTrendChart } from "@/components/molecules/RevenueTrendChart";
import { OrdersByStatusChart } from "@/components/molecules/OrdersByStatusChart";
import { RefreshButton } from "@/components/molecules/RefreshButton";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [stats, recentOrders, topProducts, cartActivity, subscriberCount, productCount, revenueTrend, ordersByStatus] = await Promise.all([
    getAdminStats(),
    getRecentOrders(6),
    getTopProducts(5),
    getCartActivity(),
    getSubscriberCount(),
    getProductCount(),
    getRevenueTrend(30),
    getOrdersByStatus(),
  ]);

  const name = user?.email?.split("@")[0] ?? "Admin";
  const greeting = greetingForHour(new Date().getHours());

  const headlineCards = [
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue, "USD"), icon: TrendingUpIcon },
    { label: "Total Orders", value: String(stats.totalOrders), icon: BagIcon },
    { label: "Customers", value: String(stats.distinctCustomers), icon: UsersIcon },
    { label: "Active Carts", value: String(cartActivity.activeCarts), icon: BoxIcon },
  ];

  const secondaryCards = [
    { label: "Avg Order Value", value: formatPrice(stats.avgOrderValue, "USD") },
    { label: "Products Listed", value: String(productCount) },
    { label: "Newsletter Subscribers", value: String(subscriberCount) },
    { label: "Items Sitting in Carts", value: String(cartActivity.itemsInCarts) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
            {greeting}, {name[0]?.toUpperCase()}{name.slice(1)}
          </h1>
          <p className="mt-1 text-[13px] text-[#8e939a]">Overview of store operations, revenue, orders and customers.</p>
        </div>
        <RefreshButton />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {headlineCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-[14px] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#8e939a]">{c.label}</p>
                <span className="grid size-8 place-items-center rounded-lg bg-panel text-ink">
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold">{c.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {secondaryCards.map((c) => (
          <div key={c.label} className="rounded-[14px] bg-white p-4">
            <p className="text-[12px] text-[#8e939a]">{c.label}</p>
            <p className="mt-1 text-lg font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[14px] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Revenue Trend (30 days)</h2>
            <Link href="/admin/orders" className="text-[13px] font-medium text-ink hover:underline">View details</Link>
          </div>
          <div className="h-[180px]">
            <RevenueTrendChart points={revenueTrend} />
          </div>
        </div>

        <div className="rounded-[14px] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Orders by Status</h2>
            <Link href="/admin/orders" className="text-[13px] font-medium text-ink hover:underline">View all</Link>
          </div>
          <div className="h-[180px]">
            <OrdersByStatusChart data={ordersByStatus} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-[14px] bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Top Selling Products</h2>
            <Link href="/admin/products" className="text-[13px] font-medium text-ink hover:underline">View all</Link>
          </div>
          {topProducts.length === 0 ? (
            <p className="rounded-[10px] bg-panel p-6 text-center text-[13px] text-[#8e939a]">No sales yet.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between gap-3 rounded-[10px] px-2 py-2.5 text-[14px]">
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

        <div className="rounded-[14px] bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[13px] font-medium text-ink hover:underline">View all orders</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="rounded-[10px] bg-panel p-6 text-center text-[13px] text-[#8e939a]">No orders placed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#eceef0] text-[#8e939a]">
                    <th className="px-3 py-2.5 font-medium">Order</th>
                    <th className="px-3 py-2.5 font-medium">Customer</th>
                    <th className="px-3 py-2.5 text-right font-medium">Amount</th>
                    <th className="px-3 py-2.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-[#eceef0] last:border-0">
                      <td className="px-3 py-2.5">
                        <Link href={`/orders/${o.id}`} className="underline hover:text-[#6b7078]">
                          #{o.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="max-w-[140px] truncate px-3 py-2.5">{o.userEmail}</td>
                      <td className="px-3 py-2.5 text-right font-medium">{formatPrice(o.total, o.currency)}</td>
                      <td className="px-3 py-2.5 text-right">
                        <Link href={`/orders/${o.id}`} className="text-ink underline hover:text-[#6b7078]">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
