import { MetaListPage } from "@/components/organisms/MetaListPage";
import { getBrands } from "@/lib/data/catalog-meta";

export default async function AdminBrandsPage() {
  const items = await getBrands();
  return (
    <MetaListPage
      title="Brands"
      description="Brands available to select when adding a product."
      table="brands"
      items={items}
    />
  );
}
