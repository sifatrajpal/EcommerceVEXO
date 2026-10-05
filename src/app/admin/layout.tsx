import Link from "next/link";
import { signOut } from "@/actions/auth";
import { AdminNavLinks } from "@/components/organisms/AdminNavLinks";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-frame">
      <aside className="fixed inset-y-0 left-0 flex w-[300px] flex-col border-r border-[#eceef0] bg-white p-6">
        <Link href="/" className="mb-8 px-1 text-xl font-semibold tracking-tight">VEXO</Link>
        <AdminNavLinks />
        <form action={signOut} className="mt-auto pt-6">
          <button
            type="submit"
            className="w-full rounded-lg bg-[#141414] px-3 py-2.5 text-[14px] font-medium text-white"
          >
            Sign Out
          </button>
        </form>
      </aside>
      <div className="ml-[300px] p-2.5">{children}</div>
    </div>
  );
}
