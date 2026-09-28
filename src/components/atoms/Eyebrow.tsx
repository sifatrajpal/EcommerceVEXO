import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[clamp(9px,0.8cqw,13px)] tracking-[0.02em]", className)}>{children}</p>;
}
