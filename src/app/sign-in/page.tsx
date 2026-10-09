import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SignInForm } from "@/components/organisms/SignInForm";

const SUCCESS_BANNERS: Record<string, string> = {
  success: "Password updated — sign in with your new password.",
};
const ERROR_BANNERS: Record<string, string> = {
  "oauth-failed": "That sign-in didn't go through — please try again.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ reset?: string; error?: string }> }) {
  const { reset, error } = await searchParams;
  const banner = reset ? SUCCESS_BANNERS[reset] : undefined;
  const errorBanner = error ? ERROR_BANNERS[error] : undefined;

  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr] gap-2.5 p-2.5">
      <SiteHeaderBar />
      <SignInForm banner={banner} errorBanner={errorBanner} />
    </main>
  );
}
