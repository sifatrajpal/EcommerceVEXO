import { MetaListPage } from "@/components/organisms/MetaListPage";
import { getCollections } from "@/lib/data/catalog-meta";

export default async function AdminCollectionsPage() {
  const items = await getCollections();
  return (
    <MetaListPage
      title="Collections"
      description="Collection labels available to select when adding a product (e.g. Men Originals)."
      table="collections"
      items={items}
    />
  );
}
