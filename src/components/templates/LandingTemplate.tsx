import { Hero } from "@/components/organisms/Hero";
import { ShopTheEdit } from "@/components/organisms/ShopTheEdit";
import { TopPicks } from "@/components/organisms/TopPicks";
import { PosterSection } from "@/components/organisms/PosterSection";
import { NewArrivals } from "@/components/organisms/NewArrivals";
import { PosterFeature } from "@/components/organisms/PosterFeature";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import type { EditTab, Product } from "@/lib/types";

/** Page layout only: decides section order and spacing. Data comes in as props. */
export function LandingTemplate({ tabs, products }: { tabs: EditTab[]; products: Product[] }) {
  return (
    <main className="grid gap-2.5 p-2.5">
      <Hero />
      <ShopTheEdit tabs={tabs} />
      <TopPicks />
      <PosterSection />
      <NewArrivals products={products} />
      <PosterFeature />
      <SiteFooter />
    </main>
  );
}
