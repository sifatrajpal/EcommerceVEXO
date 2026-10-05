"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products/new", label: "Add Product" },
];

export function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
              active ? "bg-[#141414] text-white" : "text-ink hover:bg-white"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
