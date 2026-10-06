import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "@/components/molecules/DeleteProductButton";
import { getProducts } from "@/lib/data/queries";
import { getAllColorStock, getAllSizeStock, type StockOption } from "@/lib/data/inventory";
import { formatPrice, isRecentlyAdded, LOW_STOCK_THRESHOLD } from "@/lib/utils";

function StockList({ items }: { items: StockOption[] }) {
  if (items.length === 0) return <span className="text-[#8e939a]">—</span>;
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      {items.map((s) => (
        <span key={s.id} className={s.quantity < LOW_STOCK_THRESHOLD ? "font-medium text-[#c23434]" : ""}>
          {s.name}: {s.quantity}
        </span>
      ))}
    </div>
  );
}

export default async function AdminProductsPage() {
  const [products, colorStockMap, sizeStockMap] = await Promise.all([getProducts(), getAllColorStock(), getAllSizeStock()]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-[13px] text-[#8e939a]">{products.length} products in the catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-[#141414] px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a]"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-[14px] bg-white">
        {products.length === 0 ? (
          <p className="p-10 text-center text-[#8e939a]">No products yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#eceef0] text-[#8e939a]">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Collection</th>
                  <th className="px-5 py-3 font-medium">Colors in stock</th>
                  <th className="px-5 py-3 font-medium">Sizes in stock</th>
                  <th className="px-5 py-3 font-medium">New</th>
                  <th className="px-5 py-3 text-right font-medium">Price</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-[#eceef0] last:border-0">
                    <td className="px-5 py-3">
                      <Link href={`/products/${p.id}`} className="flex items-center gap-3 hover:opacity-70">
                        <span className="relative size-10 shrink-0 overflow-hidden rounded-[8px] bg-panel">
                          <Image src={p.imageUrl} alt={p.name} fill sizes="40px" className="object-cover" />
                        </span>
                        <span className="truncate">{p.name}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 capitalize">{p.category}</td>
                    <td className="px-5 py-3">{p.collection ?? "—"}</td>
                    <td className="px-5 py-3"><StockList items={colorStockMap.get(p.id) ?? []} /></td>
                    <td className="px-5 py-3"><StockList items={sizeStockMap.get(p.id) ?? []} /></td>
                    <td className="px-5 py-3">{p.isNewArrival && isRecentlyAdded(p.createdAt) ? "Yes" : "—"}</td>
                    <td className="px-5 py-3 text-right font-medium">{formatPrice(p.price, p.currency)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/products/${p.id}/edit`} className="underline hover:text-[#6b7078]">Edit</Link>
                        <DeleteProductButton productId={p.id} productName={p.name} />
                      </div>
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
