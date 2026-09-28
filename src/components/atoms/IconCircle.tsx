import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { label: string; href?: string; onClick?: () => void; className?: string; children: ReactNode };

/** Round icon-only control. Always needs a label for screen readers. */
export function IconCircle({ label, href, onClick, className, children }: Props) {
  const classes = cn("grid place-items-center rounded-full [&>svg]:w-[45%]", className);
  return href ? (
    <Link href={href} aria-label={label} className={classes}>{children}</Link>
  ) : (
    <button type="button" aria-label={label} onClick={onClick} className={classes}>{children}</button>
  );
}
