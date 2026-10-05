import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SignUpForm } from "@/components/organisms/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr] gap-2.5 p-2.5">
      <SiteHeaderBar />
      <SignUpForm />
    </main>
  );
}
