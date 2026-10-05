import type { EditTab, Product } from "@/lib/types";

// Used when Supabase isn't configured yet (or a query fails).
export const fallbackTabs: EditTab[] = [
  { id: "featured", label: "Featured", imageA: "/images/pick-summer.png", imageB: "/images/edit-look-2.png" },
  { id: "tops", label: "Tops", imageA: "/images/edit-hood.png", imageB: "/images/edit-look-4.png" },
  { id: "shorts", label: "Shorts", imageA: "/images/edit-shorts.png", imageB: "/images/edit-look-1.png" },
  { id: "layers", label: "Layers", imageA: "/images/feature-athlete.png", imageB: "/images/edit-look-3.png" },
  { id: "outerwear", label: "Outerwear", imageA: "/images/pick-winter.png", imageB: "/images/edit-look-4.png" },
  { id: "caps", label: "Caps", imageA: "/images/edit-hood.png", imageB: "/images/edit-look-3.png" },
];

const COLLECTION_BY_CATEGORY: Record<Product["category"], string> = {
  men: "Men Originals",
  women: "Women Originals",
  unisex: "Originals",
};

// Mirrors supabase/seed.sql — keep the two in sync.
const seedProducts: { name: string; price: number; season: string; category: Product["category"]; image: string }[] = [
  { name: "ASRV x Equinox Lycra Hoodie", price: 116, season: "Winter", category: "men", image: "arrival-1" },
  { name: "ASRV x Equinox Tech Fleece", price: 116, season: "Winter", category: "men", image: "arrival-2" },
  { name: "ASRV x Equinox Sling Set", price: 116, season: "Winter", category: "women", image: "arrival-3" },
  { name: "ASRV x Equinox Anorak", price: 116, season: "Winter", category: "unisex", image: "arrival-4" },
  { name: "ASRV x Equinox Cargo", price: 124, season: "Winter", category: "men", image: "arrival-5" },
  { name: "ASRV x Equinox Shell", price: 132, season: "Winter", category: "women", image: "arrival-6" },
  { name: "ASRV x Equinox Lycra Short", price: 88, season: "Summer", category: "women", image: "arrival-7" },
  { name: "ASRV x Equinox Sand Set", price: 98, season: "Summer", category: "unisex", image: "arrival-8" },
  { name: "ASRV x Equinox Ribbed Polo", price: 104, season: "Summer", category: "men", image: "arrival-9" },
  { name: "ASRV x Equinox Wool Blazer", price: 168, season: "Winter", category: "men", image: "arrival-10" },
  { name: "ASRV x Equinox Stripe Set", price: 112, season: "Summer", category: "men", image: "arrival-11" },
  { name: "ASRV x Equinox Knit Tee", price: 92, season: "Summer", category: "men", image: "arrival-12" },
  { name: "ASRV x Equinox Tailored Suit", price: 176, season: "Winter", category: "women", image: "arrival-13" },
];

export const fallbackProducts: Product[] = seedProducts.map((p, i) => ({
  id: `fallback-${i}`,
  name: p.name,
  price: p.price,
  currency: "USD",
  season: p.season,
  category: p.category,
  collection: COLLECTION_BY_CATEGORY[p.category],
  imageUrl: `/images/${p.image}.png`,
  isNewArrival: i < 4,
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));
