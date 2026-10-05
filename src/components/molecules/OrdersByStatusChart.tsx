type StatusCount = { status: string; count: number };

export function OrdersByStatusChart({ data }: { data: StatusCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex h-full flex-col justify-center gap-5">
      {data.map((d) => (
        <div key={d.status}>
          <div className="mb-1.5 flex items-center justify-between text-[13px]">
            <span className="capitalize text-[#6b7078]">{d.status}</span>
            <span className="font-medium">{d.count}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#eceef0]">
            <div
              className="h-full rounded-full bg-[#141414] transition-[width] duration-500"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
