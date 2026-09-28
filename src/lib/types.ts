export type ProductCategory = "men" | "women" | "unisex";

export type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  season: string;
  category: ProductCategory;
  imageUrl: string;
};

export type EditTab = {
  id: string;
  label: string;
  imageA: string;
  imageB: string;
};
