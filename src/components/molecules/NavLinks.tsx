import Link from "next/link";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; href: string };

export function NavLinks({ items, label, className }: { items: NavItem[]; label: string; className?: string }) {
  return (
    <nav aria-label={label} className={cn("flex gap-[2.2cqw] text-[clamp(9px,0.95cqw,15px)] tracking-[0.02em]", className)}>
      {items.map((item) => (
        <Link key={item.label} href={item.href} className="hover:opacity-60">{item.label}</Link>
      ))}
    </nav>
  );
}
