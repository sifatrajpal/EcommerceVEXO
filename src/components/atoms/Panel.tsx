import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  as?: "section" | "footer" | "div";
  /** Background utility, e.g. "bg-[#121212]". Defaults to the light panel colour. */
  background?: string;
};

/**
 * Rounded page panel. The outer element is a CSS container, so every size inside
 * can use `cqw` (1cqw = 1% of the panel width) and the design scales as one piece.
 */
export function Panel({ as: Tag = "section", background = "bg-panel", className, children, ...rest }: PanelProps) {
  return (
    <Tag className="@container w-full">
      <div className={cn("relative w-full overflow-hidden rounded-[22px]", background, className)} {...rest}>
        {children}
      </div>
    </Tag>
  );
}
