import { LandingTemplate } from "@/components/templates/LandingTemplate";
import { getEditTabs, getNewArrivals } from "@/lib/data/queries";
import { getActiveTheme } from "@/lib/data/settings";

// Re-fetch Supabase data at most once a minute (ISR).
export const revalidate = 60;

export default async function HomePage() {
  const [tabs, products, theme] = await Promise.all([getEditTabs(), getNewArrivals(), getActiveTheme()]);
  return <LandingTemplate tabs={tabs} products={products} theme={theme} />;
}
