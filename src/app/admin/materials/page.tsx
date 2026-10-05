import { MetaListPage } from "@/components/organisms/MetaListPage";
import { getMaterials } from "@/lib/data/catalog-meta";

export default async function AdminMaterialsPage() {
  const items = await getMaterials();
  return (
    <MetaListPage
      title="Materials"
      description="Materials available to select when adding a product."
      table="materials"
      items={items}
    />
  );
}
