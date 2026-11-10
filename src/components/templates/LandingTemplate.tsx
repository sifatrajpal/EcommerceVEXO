import { Hero } from "@/components/organisms/Hero";
import { CategoryRow } from "@/components/organisms/CategoryRow";
import { ShopTheEdit } from "@/components/organisms/ShopTheEdit";
import { TopPicks } from "@/components/organisms/TopPicks";
import { PosterSection } from "@/components/organisms/PosterSection";
import { NewArrivals } from "@/components/organisms/NewArrivals";
import { PosterFeature } from "@/components/organisms/PosterFeature";
import { Reviews } from "@/components/organisms/Reviews";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { AnnouncementBar } from "@/components/organisms/AnnouncementBar";
import { CuratedCollections } from "@/components/organisms/CuratedCollections";
import { FeatureStrip } from "@/components/organisms/FeatureStrip";
import { PromoCards } from "@/components/organisms/PromoCards";
import { RecommendedChips } from "@/components/organisms/RecommendedChips";
import type { EditTab, Product } from "@/lib/types";
import type { Theme } from "@/lib/data/settings";

/** Each theme orders its sections differently, so no two feel like the same page reskinned. */
function sectionsFor(theme: Theme, tabs: EditTab[], products: Product[]) {
  const shopTheEdit = <ShopTheEdit key="shop-the-edit" tabs={tabs} theme={theme} />;
  const topPicks = <TopPicks key="top-picks" theme={theme} />;
  const posterSection = <PosterSection key="poster-section" theme={theme} />;
  const newArrivals = <NewArrivals key="new-arrivals" products={products} theme={theme} />;
  const posterFeature = <PosterFeature key="poster-feature" theme={theme} />;

  switch (theme) {
    case "elanora":
      // Follows the reference design's flow: arrivals right after categories, reviews
      // right after arrivals, then the edit standing in for its promo banners, feature, picks.
      return [newArrivals, <Reviews key="reviews" />, shopTheEdit, posterFeature, topPicks];
    case "studio":
      // Boutique pace: arrivals first, then the card-based promo row (replacing the
      // marquee posters), the edit, top picks, and a closing recommend row.
      return [newArrivals, <PromoCards key="promo-cards" />, shopTheEdit, topPicks, <RecommendedChips key="recommended" />];
    default:
      return [shopTheEdit, topPicks, posterSection, newArrivals, posterFeature];
  }
}

/** Page layout only: decides section order and spacing. Data comes in as props. */
export function LandingTemplate({ tabs, products, theme }: { tabs: EditTab[]; products: Product[]; theme: Theme }) {
  const sections = sectionsFor(theme, tabs, products);

  return (
    <main className="grid gap-2.5 p-2.5">
      <AnnouncementBar />
      <Hero theme={theme} />
      {theme === "elanora" && <CategoryRow />}
      {theme === "studio" && <CuratedCollections />}
      {theme === "studio" && <FeatureStrip />}
      {sections}
      <SiteFooter theme={theme} />
    </main>
  );
}
