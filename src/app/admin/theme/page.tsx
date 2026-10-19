import { getActiveTheme } from "@/lib/data/settings";
import { AdminThemeForm } from "@/components/organisms/AdminThemeForm";

export default async function AdminThemePage() {
  const active = await getActiveTheme();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Theme</h1>
        <p className="mt-1 text-[13px] text-[#8e939a]">Changes the look of the whole storefront for every visitor.</p>
      </div>

      <div className="rounded-[14px] bg-white p-5">
        <AdminThemeForm active={active} />
      </div>
    </div>
  );
}
