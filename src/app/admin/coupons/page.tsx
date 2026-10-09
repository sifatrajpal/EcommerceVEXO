import { getCoupons } from "@/lib/data/coupons";
import { toggleCoupon, deleteCoupon } from "@/actions/admin-coupons";
import { AdminCouponForm } from "@/components/organisms/AdminCouponForm";
import { formatPrice } from "@/lib/utils";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
        <p className="mt-1 text-[13px] text-[#8e939a]">{coupons.length} coupon{coupons.length === 1 ? "" : "s"} created</p>
      </div>

      <div className="rounded-[14px] bg-white p-5">
        <AdminCouponForm />
      </div>

      <div className="overflow-hidden rounded-[14px] bg-white">
        {coupons.length === 0 ? (
          <p className="p-10 text-center text-[#8e939a]">No coupons yet — create one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#eceef0] text-[#8e939a]">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Discount</th>
                  <th className="px-5 py-3 font-medium">Expires</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-[#eceef0] last:border-0">
                    <td className="px-5 py-3 font-medium">{c.code}</td>
                    <td className="px-5 py-3">
                      {c.discountType === "percent" ? `${c.discountValue}% off` : `${formatPrice(c.discountValue)} off`}
                    </td>
                    <td className="px-5 py-3 text-[#8e939a]">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[12px] font-medium ${
                          c.active ? "bg-[#e3f6e8] text-[#1f7a3d]" : "bg-panel text-[#8e939a]"
                        }`}
                      >
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <form action={toggleCoupon}>
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="active" value={String(c.active)} />
                          <button type="submit" className="underline hover:text-[#6b7078]">
                            {c.active ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                        <form action={deleteCoupon}>
                          <input type="hidden" name="id" value={c.id} />
                          <button type="submit" className="text-[#c23434] underline hover:text-[#9c2a2a]">Delete</button>
                        </form>
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
