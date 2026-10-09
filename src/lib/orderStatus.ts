/** The order lifecycle: placed → confirmed → processing → shipped → delivered, with cancelled as a terminal exception. */
export const ORDER_STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_COPY: Record<OrderStatus, { label: string; sub: string }> = {
  placed: { label: "Order placed", sub: "We're preparing your order." },
  confirmed: { label: "Order confirmed", sub: "Your order has been confirmed." },
  processing: { label: "Processing", sub: "Your order is being processed." },
  shipped: { label: "Shipped", sub: "Your order is on its way." },
  delivered: { label: "Delivered", sub: "Your package was delivered." },
  cancelled: { label: "Order cancelled", sub: "This order was cancelled." },
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  placed: "bg-[#fff4e0] text-[#9a6b00]",
  confirmed: "bg-[#e6f0ff] text-[#1a4fa0]",
  processing: "bg-[#f1e8ff] text-[#6b3fa0]",
  shipped: "bg-[#e0f7fa] text-[#0d7490]",
  delivered: "bg-[#e3f6e8] text-[#1f7a3d]",
  cancelled: "bg-[#fde8e8] text-[#b42318]",
};

/** The forward-moving steps shown on the customer-facing tracker — cancelled is handled separately. */
export const ORDER_TRACKER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];
