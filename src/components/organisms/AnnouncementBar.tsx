import Link from "next/link";
import { getActiveTheme } from "@/lib/data/settings";

/** Élanora-only top bar, echoing the reference design's topbar. Renders nothing on the Default theme. */
export async function AnnouncementBar() {
  const theme = await getActiveTheme();
  if (theme !== "elanora") return null;

  return (
    <div className="flex items-center justify-between bg-panel px-4 py-2 text-[12px] text-ink sm:px-8">
      <div className="flex gap-4 max-sm:hidden">
        <span>Free Shipping on Orders Over $99</span>
        <span className="border-l border-ghost pl-4">Easy Returns within 30 Days</span>
      </div>
      <div className="flex gap-6 sm:ml-auto">
        <Link href="/account" className="hover:underline">Track Order</Link>
        <Link href="/contact" className="hover:underline">Help Center</Link>
      </div>
    </div>
  );
}
