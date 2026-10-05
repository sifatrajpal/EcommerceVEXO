import { MetaListPage } from "@/components/organisms/MetaListPage";
import { getColors } from "@/lib/data/catalog-meta";

export default async function AdminColorsPage() {
  const items = await getColors();
  return (
    <MetaListPage
      title="Colors"
      description="The color swatches shown on every product page are generated from this list."
      table="colors"
      items={items}
      withHex
    />
  );
}
