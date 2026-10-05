"use client";

import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GridIcon,
  BagIcon,
  BoxIcon,
  PlusIcon,
  SearchIcon,
  BellIcon,
  LogOutIcon,
  PanelLeftIcon,
  ReceiptIcon,
  TagIcon,
  RulerIcon,
  PaletteIcon,
  LayersIcon,
} from "@/components/atoms/Icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;
type NavItem = { href: string; label: string; icon: IconType };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: GridIcon }] },
  {
    label: "Commerce",
    items: [
      { href: "/admin/orders", label: "Orders", icon: BagIcon },
      { href: "/admin/invoices", label: "Invoices", icon: ReceiptIcon },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: BoxIcon },
      { href: "/admin/products/new", label: "Add Product", icon: PlusIcon },
      { href: "/admin/categories", label: "Categories", icon: GridIcon },
      { href: "/admin/brands", label: "Brands", icon: TagIcon },
      { href: "/admin/collections", label: "Collections", icon: LayersIcon },
      { href: "/admin/sizes", label: "Sizes", icon: RulerIcon },
      { href: "/admin/colors", label: "Colors", icon: PaletteIcon },
      { href: "/admin/materials", label: "Materials", icon: ReceiptIcon },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/invoices": "Invoices",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/categories": "Categories",
  "/admin/brands": "Brands",
  "/admin/collections": "Collections",
  "/admin/sizes": "Sizes",
  "/admin/colors": "Colors",
  "/admin/materials": "Materials",
};

type Props = {
  userEmail: string;
  notifications: number;
  signOutAction: () => Promise<void>;
  children: ReactNode;
};

export function AdminShell({ userEmail, notifications, signOutAction, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Admin";
  const initial = (userEmail[0] ?? "A").toUpperCase();

  return (
    <div className="min-h-screen bg-frame">
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex flex-col border-r border-[#eceef0] bg-white transition-[width] duration-200 ${
          collapsed ? "w-[76px] p-3" : "w-[280px] p-5"
        }`}
      >
        <div className={`mb-6 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link href="/" className="leading-tight">
              <span className="text-lg font-semibold tracking-tight">VEXO</span>
              <span className="block text-[11px] font-normal text-[#8e939a]">Admin Console</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-[#8e939a] transition-colors hover:bg-panel hover:text-ink"
          >
            <PanelLeftIcon className="size-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-1.5 px-2.5 text-[11px] font-medium tracking-[0.06em] text-[#8e939a]">
                  {group.label.toUpperCase()}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium transition-colors ${
                        active ? "bg-[#141414] text-white" : "text-ink hover:bg-panel"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Icon className="size-[18px] shrink-0" />
                      {!collapsed && item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={`mt-4 border-t border-[#eceef0] pt-4 ${collapsed ? "flex flex-col items-center gap-2" : "flex items-center gap-2.5"}`}>
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#141414] text-[13px] font-semibold text-white">
            {initial}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">Admin</p>
              <p className="truncate text-[12px] text-[#8e939a]">{userEmail}</p>
            </div>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              aria-label="Sign out"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-[#8e939a] transition-colors hover:bg-panel hover:text-ink"
            >
              <LogOutIcon className="size-4" />
            </button>
          </form>
        </div>
      </aside>

      <div className={`transition-[margin] duration-200 ${collapsed ? "ml-[76px]" : "ml-[280px]"}`}>
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#eceef0] bg-white px-6 py-3.5">
          <div className="flex items-center gap-2.5 text-[13px] text-[#8e939a]">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span className="font-medium text-ink">{title}</span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="relative hidden max-w-[260px] flex-1 sm:block">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8e939a]" />
              <input
                disabled
                placeholder="Search coming soon…"
                className="w-full rounded-lg border border-[#e4e5e8] bg-panel py-2 pr-3 pl-9 text-[13px] text-ink placeholder:text-[#8e939a] disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="button"
              aria-label={`${notifications} orders placed in the last 24 hours`}
              title={`${notifications} orders placed in the last 24 hours`}
              className="relative grid size-9 shrink-0 place-items-center rounded-lg text-[#6b7078] transition-colors hover:bg-panel"
            >
              <BellIcon className="size-[18px]" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-[#c23434] text-[10px] font-semibold text-white">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 border-l border-[#eceef0] pl-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-panel text-[12px] font-semibold">{initial}</div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-[13px] font-medium">Admin</p>
                <p className="text-[11px] text-[#8e939a]">{userEmail}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
