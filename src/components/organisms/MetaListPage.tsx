import { deleteMetaItem } from "@/actions/catalog-meta";
import type { MetaTable } from "@/actions/catalog-meta";
import { MetaAddForm } from "@/components/organisms/MetaAddForm";
import type { MetaItem } from "@/lib/data/catalog-meta";

type Props = {
  title: string;
  description: string;
  table: MetaTable;
  items: MetaItem[];
  withHex?: boolean;
};

export function MetaListPage({ title, description, table, items, withHex = false }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-[13px] text-[#8e939a]">{description}</p>
      </div>

      <div className="rounded-[14px] bg-white p-5">
        <MetaAddForm table={table} withHex={withHex} />
      </div>

      <div className="overflow-hidden rounded-[14px] bg-white">
        {items.length === 0 ? (
          <p className="p-10 text-center text-[#8e939a]">Nothing here yet — add the first one above.</p>
        ) : (
          <ul className="divide-y divide-[#eceef0]">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="flex items-center gap-2.5 text-[14px]">
                  {withHex && item.hex && (
                    <span className="size-4 shrink-0 rounded-full border border-[#e4e5e8]" style={{ backgroundColor: item.hex }} />
                  )}
                  {item.name}
                </span>
                <form action={deleteMetaItem}>
                  <input type="hidden" name="table" value={table} />
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="text-[13px] text-[#c23434] hover:underline">Remove</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
