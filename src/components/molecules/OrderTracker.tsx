const STEPS = [
  { key: "placed", label: "Order Placed" },
  { key: "fulfilled", label: "Delivered" },
];

/** A simple two-step progress tracker driven by the order's real status. */
export function OrderTracker({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <p className="mt-6 rounded-[10px] bg-[#fde8e8] px-4 py-3 text-[13px] font-medium text-[#b42318]">
        This order was cancelled.
      </p>
    );
  }

  const activeIndex = status === "fulfilled" ? 1 : 0;

  return (
    <div className="mt-6 flex items-center gap-2">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex flex-1 items-center gap-2 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                i <= activeIndex ? "bg-[#141414] text-white" : "bg-[#eceef0] text-[#8e939a]"
              }`}
            >
              {i + 1}
            </span>
            <span className={`whitespace-nowrap text-[11px] font-medium ${i <= activeIndex ? "text-ink" : "text-[#8e939a]"}`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && <span className={`h-px flex-1 ${i < activeIndex ? "bg-[#141414]" : "bg-[#eceef0]"}`} />}
        </div>
      ))}
    </div>
  );
}
