import type { NavItem } from "@/components/molecules/NavLinks";

export const primaryNav: NavItem[] = [
  { label: "SHOP", href: "/shop" },
  { label: "MEN", href: "/shop?category=men" },
  { label: "WOMEN", href: "/shop?category=women" },
  { label: "TRENDING", href: "/shop" },
];

export const secondaryNav: NavItem[] = [
  { label: "SEASONAL", href: "#" },
  { label: "ACCESSORIES", href: "#" },
];

export const footerColumns: { title: string; links: NavItem[] }[] = [
  {
    title: "SHOP",
    links: [
      { label: "Men", href: "/shop?category=men" },
      { label: "Women", href: "/shop?category=women" },
      { label: "Trending", href: "/shop" },
      { label: "Seasonal", href: "#" },
      { label: "Accessories", href: "#" },
    ],
  },
  { title: "HELP", links: ["Shipping", "Returns", "Size guide", "Contact us"].map((l) => ({ label: l, href: "#" })) },
  { title: "FOLLOW", links: ["Instagram", "TikTok", "YouTube", "Pinterest"].map((l) => ({ label: l, href: "#" })) },
];
