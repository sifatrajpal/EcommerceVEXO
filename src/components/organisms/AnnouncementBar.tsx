import Link from "next/link";
import { getActiveTheme, type Theme } from "@/lib/data/settings";

const COPY: Partial<Record<Theme, [string, string]>> = {
  elanora: ["Free Shipping on Orders Over $99", "Easy Returns within 30 Days"],
  studio: ["Complimentary Shipping Over $99", "30-Day Easy Returns"],
};

/** Top bar for every theme except Default — each with its own copy. Renders nothing on Default. */
export async function AnnouncementBar() {
  const theme = await getActiveTheme();
  const copy = COPY[theme];
  if (!copy) return null;
  const [left, right] = copy;

  return (
    <div className="flex items-center justify-between bg-panel px-4 py-2 text-[12px] text-ink sm:px-8">
      <div className="flex gap-4 max-sm:hidden">
        <span>{left}</span>
        <span className="border-l border-ghost pl-4">{right}</span>
      </div>
      <div className="flex gap-6 sm:ml-auto">
        <Link href="/account" className="hover:underline">Track Order</Link>
        <Link href="/contact" className="hover:underline">Help Center</Link>
      </div>
    </div>
  );
}
