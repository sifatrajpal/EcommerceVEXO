import { MetaListPage } from "@/components/organisms/MetaListPage";
import { getCategories } from "@/lib/data/catalog-meta";

export default async function AdminCategoriesPage() {
  const items = await getCategories();
  return (
    <MetaListPage
      title="Categories"
      description="Reference list of product categories."
      table="categories"
      items={items}
    />
  );
}
