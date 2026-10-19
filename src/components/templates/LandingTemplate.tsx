import { Hero } from "@/components/organisms/Hero";
import { ShopTheEdit } from "@/components/organisms/ShopTheEdit";
import { TopPicks } from "@/components/organisms/TopPicks";
import { PosterSection } from "@/components/organisms/PosterSection";
import { NewArrivals } from "@/components/organisms/NewArrivals";
import { PosterFeature } from "@/components/organisms/PosterFeature";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { AnnouncementBar } from "@/components/organisms/AnnouncementBar";
import type { EditTab, Product } from "@/lib/types";
import type { Theme } from "@/lib/data/settings";

/** Page layout only: decides section order and spacing. Data comes in as props. */
export function LandingTemplate({ tabs, products, theme }: { tabs: EditTab[]; products: Product[]; theme: Theme }) {
  const sections =
    theme === "elanora"
      ? [
          <TopPicks key="top-picks" theme={theme} />,
          <NewArrivals key="new-arrivals" products={products} />,
          <ShopTheEdit key="shop-the-edit" tabs={tabs} theme={theme} />,
          <PosterFeature key="poster-feature" theme={theme} />,
          <PosterSection key="poster-section" theme={theme} />,
        ]
      : [
          <ShopTheEdit key="shop-the-edit" tabs={tabs} theme={theme} />,
          <TopPicks key="top-picks" theme={theme} />,
          <PosterSection key="poster-section" theme={theme} />,
          <NewArrivals key="new-arrivals" products={products} />,
          <PosterFeature key="poster-feature" theme={theme} />,
        ];

  return (
    <main className="grid gap-2.5 p-2.5">
      <AnnouncementBar />
      <Hero theme={theme} />
      {sections}
      <SiteFooter />
    </main>
  );
}
