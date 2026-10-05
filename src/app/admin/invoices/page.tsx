import Link from "next/link";
import { getAllOrders } from "@/lib/data/admin-stats";
import { formatPrice } from "@/lib/utils";

export default async function AdminInvoicesPage() {
  const orders = await getAllOrders();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <p className="mt-1 text-[13px] text-[#8e939a]">{orders.length} invoices generated from placed orders.</p>
      </div>

      <div className="overflow-hidden rounded-[14px] bg-white">
        {orders.length === 0 ? (
          <p className="p-10 text-center text-[#8e939a]">No invoices yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#eceef0] text-[#8e939a]">
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Billed To</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-[#eceef0] last:border-0">
                    <td className="px-5 py-3">INV-{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-5 py-3">{o.userEmail}</td>
                    <td className="px-5 py-3 text-[#8e939a]">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right font-medium">{formatPrice(o.total, o.currency)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/orders/${o.id}`} className="underline hover:text-[#6b7078]">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
