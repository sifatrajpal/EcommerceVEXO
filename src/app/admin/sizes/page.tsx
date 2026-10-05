import { MetaListPage } from "@/components/organisms/MetaListPage";
import { getSizes } from "@/lib/data/catalog-meta";

export default async function AdminSizesPage() {
  const items = await getSizes();
  return (
    <MetaListPage
      title="Sizes"
      description="The size picker shown on every product page is generated from this list."
      table="sizes"
      items={items}
    />
  );
}
