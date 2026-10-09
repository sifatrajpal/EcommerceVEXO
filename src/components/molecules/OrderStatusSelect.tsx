"use client";

import { updateOrderStatus } from "@/actions/orders";

const STATUSES = ["placed", "fulfilled", "cancelled"] as const;

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-[#fff4e0] text-[#9a6b00]",
  fulfilled: "bg-[#e3f6e8] text-[#1f7a3d]",
  cancelled: "bg-[#fde8e8] text-[#b42318]",
};

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  return (
    <form action={updateOrderStatus}>
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className={`rounded-full border-0 px-2.5 py-1 text-[12px] font-medium capitalize outline-none ${STATUS_STYLES[status] ?? "bg-panel text-ink"}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </form>
  );
}
