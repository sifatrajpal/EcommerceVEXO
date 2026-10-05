import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SignInForm } from "@/components/organisms/SignInForm";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr] gap-2.5 p-2.5">
      <SiteHeaderBar />
      <SignInForm />
    </main>
  );
}
