export type ProductCategory = "men" | "women" | "unisex";

export type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  season: string;
  category: ProductCategory;
  collection: string | null;
  brand: string | null;
  material: string | null;
  imageUrl: string;
  isNewArrival: boolean;
  createdAt: string;
};

export type EditTab = {
  id: string;
  label: string;
  imageA: string;
  imageB: string;
};
