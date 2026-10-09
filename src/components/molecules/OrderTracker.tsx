import { ORDER_TRACKER_STEPS } from "@/lib/orderStatus";

/** A progress tracker driven by the order's real status: placed → confirmed → processing → shipped → delivered. */
export function OrderTracker({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <p className="mt-6 rounded-[10px] bg-[#fde8e8] px-4 py-3 text-[13px] font-medium text-[#b42318]">
        This order was cancelled.
      </p>
    );
  }

  const activeIndex = Math.max(0, ORDER_TRACKER_STEPS.findIndex((s) => s.key === status));

  return (
    <div className="mt-6 flex items-start gap-1">
      {ORDER_TRACKER_STEPS.map((step, i) => (
        <div key={step.key} className="flex flex-1 items-center gap-1 last:flex-none">
          <div className="flex w-14 flex-col items-center gap-1.5 text-center">
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                i <= activeIndex ? "bg-[#141414] text-white" : "bg-[#eceef0] text-[#8e939a]"
              }`}
            >
              {i + 1}
            </span>
            <span className={`text-[11px] leading-tight font-medium ${i <= activeIndex ? "text-ink" : "text-[#8e939a]"}`}>
              {step.label}
            </span>
          </div>
          {i < ORDER_TRACKER_STEPS.length - 1 && (
            <span className={`mt-[-18px] h-px flex-1 ${i < activeIndex ? "bg-[#141414]" : "bg-[#eceef0]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
