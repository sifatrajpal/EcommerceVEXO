import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { isCurrentUserAdmin } from "@/lib/admin";
import { AdminProductForm } from "@/components/organisms/AdminProductForm";

export default async function NewProductPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) notFound();

  return (
    <div className="mx-auto max-w-[720px] rounded-[22px] bg-panel px-6 py-8 md:px-10 md:py-10">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">ADD PRODUCT</h1>
      <p className="mt-1 text-[13px] text-[#8e939a]">Upload a new item into the catalog.</p>

      <div className="mt-8">
        <AdminProductForm />
      </div>
    </div>
  );
}
