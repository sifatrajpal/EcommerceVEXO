import { cn } from "@/lib/utils";

/** Pill label, e.g. "Winter" or "LOOKBOOK 2026". No default text color — callers that keep the
 * default white chip (an overlay on a photo, so it must stay light in every theme) pass their own
 * dark text color; callers that swap the background for a themed one pass a token-driven color. */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-grid place-items-center rounded-full bg-white/95 px-[1.1cqw] py-[0.45cqw] text-[clamp(9px,0.78cqw,12px)]", className)}>
      {children}
    </span>
  );
}
