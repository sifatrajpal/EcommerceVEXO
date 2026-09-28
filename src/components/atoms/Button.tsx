import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  dark: "bg-[#141414] text-white",
  light: "bg-white text-ink",
  subtle: "bg-panel text-ink",
} as const;

const shapes = {
  pill: "rounded-full px-[1.7cqw] py-[1.2cqw]",
  square: "rounded-[0.7cqw] px-[2.4cqw] py-[1.2cqw]",
} as const;

type Base = { variant?: keyof typeof variants; shape?: keyof typeof shapes; className?: string };
type AsLink = Base & { href: string } & Omit<ComponentProps<typeof Link>, "className">;
type AsButton = Base & { href?: undefined } & Omit<ComponentProps<"button">, "className">;

export function Button({ variant = "dark", shape = "pill", className, ...props }: AsLink | AsButton) {
  const classes = cn(
    "inline-flex items-center justify-center text-[clamp(9px,0.85cqw,13px)] tracking-[0.03em] whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5",
    variants[variant],
    shapes[shape],
    className,
  );
  if ("href" in props && props.href !== undefined) return <Link {...(props as AsLink)} className={classes} />;
  return <button type="button" {...(props as AsButton)} className={classes} />;
}
