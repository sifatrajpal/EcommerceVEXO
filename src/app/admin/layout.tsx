import { redirect, notFound } from "next/navigation";
import { signOut } from "@/actions/auth";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { isCurrentUserAdmin } from "@/lib/admin";
import { getRecentOrderCount } from "@/lib/data/admin-stats";
import { AdminShell } from "@/components/organisms/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) notFound();

  const notifications = await getRecentOrderCount(24);

  return (
    <AdminShell userEmail={user.email ?? ""} notifications={notifications} signOutAction={signOut}>
      {children}
    </AdminShell>
  );
}
