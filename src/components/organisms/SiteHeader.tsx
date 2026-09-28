import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { IconCircle } from "@/components/atoms/IconCircle";
import { BagIcon } from "@/components/atoms/Icons";
import { NavLinks } from "@/components/molecules/NavLinks";
import { MenuButton } from "@/components/molecules/MenuButton";
import { primaryNav, secondaryNav } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { signOut } from "@/actions/auth";
import { getCartItems } from "@/lib/data/cart";
import { isCurrentUserAdmin } from "@/lib/admin";

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const cartCount = user ? (await getCartItems()).reduce((n, item) => n + item.quantity, 0) : 0;
  const admin = user ? await isCurrentUserAdmin() : false;

  return (
    <header className="relative z-40 grid animate-drop grid-cols-[1fr_auto_1fr] items-center px-[2.6cqw] pt-[1.6cqw] [animation-delay:0.7s]">
      <div className="flex items-center gap-[2.2cqw] justify-self-start">
        <NavLinks items={[...primaryNav, ...secondaryNav]} label="Primary" className="max-md:hidden" />
        <MenuButton items={[...primaryNav, ...secondaryNav]} className="md:hidden" />
      </div>
      <Link href="/" className="col-start-2 -mt-[0.6cqw] text-[clamp(24px,3.2cqw,46px)] font-semibold tracking-[0.02em]">VEXO</Link>
      <div className="flex items-center gap-[2.2cqw] justify-self-end">
        <div className="flex items-center gap-[0.2cqw]">
          {admin && (
            <Button href="/admin" variant="subtle" shape="pill" className="!px-[1.6cqw] !py-[1cqw]">ADMIN</Button>
          )}
          {user ? (
            <form action={signOut}>
              <Button type="submit" shape="pill" className="!px-[1.6cqw] !py-[1cqw]">SIGN OUT</Button>
            </form>
          ) : (
            <Button href="/sign-in" shape="pill" className="!px-[1.6cqw] !py-[1cqw]">SIGN&nbsp; IN / UP</Button>
          )}
          <IconCircle label="Cart" href="/cart" className="relative size-[3.1cqw] min-h-7 min-w-7 bg-[#141414] text-white">
            <BagIcon />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-white text-[10px] text-ink">
                {cartCount}
              </span>
            )}
          </IconCircle>
        </div>
      </div>
    </header>
  );
}
