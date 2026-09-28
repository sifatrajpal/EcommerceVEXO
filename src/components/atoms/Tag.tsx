import { cn } from "@/lib/utils";

/** White pill label, e.g. "Winter" or "LOOKBOOK 2026". */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-grid place-items-center rounded-full bg-white/95 px-[1.1cqw] py-[0.45cqw] text-[clamp(9px,0.78cqw,12px)]", className)}>
      {children}
    </span>
  );
}
