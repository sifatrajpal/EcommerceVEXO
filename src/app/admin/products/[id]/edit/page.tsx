import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/organisms/AdminProductForm";
import { getProductById } from "@/lib/data/queries";
import { getCategories, getCollections, getBrands, getMaterials, getColors, getSizes } from "@/lib/data/catalog-meta";
import { getProductColorStock, getProductSizeStock } from "@/lib/data/inventory";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, collections, brands, materials, allColors, allSizes, colorStock, sizeStock] = await Promise.all([
    getProductById(id),
    getCategories(),
    getCollections(),
    getBrands(),
    getMaterials(),
    getColors(),
    getSizes(),
    getProductColorStock(id),
    getProductSizeStock(id),
  ]);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-[720px] rounded-[14px] bg-white p-6 md:p-10">
      <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
      <p className="mt-1 text-[13px] text-[#8e939a]">{product.name}</p>

      <div className="mt-8">
        <AdminProductForm
          categories={categories}
          collections={collections}
          brands={brands}
          materials={materials}
          allColors={allColors}
          allSizes={allSizes}
          colorStock={colorStock}
          sizeStock={sizeStock}
          product={product}
        />
      </div>
    </div>
  );
}
