"use client";

import { updateOrderStatus } from "@/actions/orders";
import { ORDER_STATUSES, ORDER_STATUS_STYLES } from "@/lib/orderStatus";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  return (
    <form action={updateOrderStatus}>
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className={`rounded-full border-0 px-2.5 py-1 text-[12px] font-medium capitalize outline-none ${ORDER_STATUS_STYLES[status as keyof typeof ORDER_STATUS_STYLES] ?? "bg-panel text-ink"}`}
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </form>
  );
}
