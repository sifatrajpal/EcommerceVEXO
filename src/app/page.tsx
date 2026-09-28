import { LandingTemplate } from "@/components/templates/LandingTemplate";
import { getEditTabs, getNewArrivals } from "@/lib/data/queries";

// Re-fetch Supabase data at most once a minute (ISR).
export const revalidate = 60;

export default async function HomePage() {
  const [tabs, products] = await Promise.all([getEditTabs(), getNewArrivals()]);
  return <LandingTemplate tabs={tabs} products={products} />;
}
