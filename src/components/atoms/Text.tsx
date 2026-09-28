import { cn } from "@/lib/utils";

/** Small body copy used across sections. */
export function Text({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[clamp(10px,0.88cqw,14px)] leading-[1.5] text-muted", className)}>{children}</p>;
}
