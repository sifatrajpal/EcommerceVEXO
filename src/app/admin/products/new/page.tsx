import { AdminProductForm } from "@/components/organisms/AdminProductForm";
import { getCategories, getCollections, getBrands, getMaterials } from "@/lib/data/catalog-meta";

export default async function NewProductPage() {
  const [categories, collections, brands, materials] = await Promise.all([
    getCategories(),
    getCollections(),
    getBrands(),
    getMaterials(),
  ]);

  return (
    <div className="mx-auto max-w-[720px] rounded-[14px] bg-white p-6 md:p-10">
      <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
      <p className="mt-1 text-[13px] text-[#8e939a]">Upload a new item into the catalog.</p>

      <div className="mt-8">
        <AdminProductForm categories={categories} collections={collections} brands={brands} materials={materials} />
      </div>
    </div>
  );
}
