import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SiteFooter } from "@/components/organisms/SiteFooter";

const COOKIES = [
  { name: "Session", purpose: "Keeps you signed in as you move between pages.", duration: "Expires when you sign out" },
  { name: "Cart", purpose: "Remembers what's in your shopping bag.", duration: "Persists while you have an account" },
  { name: "Like preference", purpose: "A random id so you can like products without an account.", duration: "Stored in your browser indefinitely" },
];

export default function CookiesPage() {
  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />

      <Panel className="px-[3.4cqw] pt-[4.2cqw] pb-[3.4cqw]">
        <Eyebrow className="mb-[1.6cqw] text-[#8e939a]">Legal</Eyebrow>
        <AnimatedHeading lines={["COOKIE", "POLICY"]} className="mb-[2cqw] text-[3.6cqw] leading-[0.95] font-medium tracking-[-0.04em]" />
        <Text className="max-w-[40cqw] max-md:max-w-none">
          We keep cookie use to a minimum — just what's needed to keep you signed in and your cart intact.
        </Text>

        <div className="mt-[2.8cqw] overflow-hidden rounded-[1.1cqw] bg-panel">
          <table className="w-full text-left text-[clamp(11px,0.9cqw,15px)]">
            <thead>
              <tr className="border-b border-[#d8dade] text-[#6b7078]">
                <th className="px-[1.6cqw] py-[1.2cqw] font-medium">Cookie</th>
                <th className="px-[1.6cqw] py-[1.2cqw] font-medium">Purpose</th>
                <th className="px-[1.6cqw] py-[1.2cqw] font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.name} className="border-b border-[#d8dade] last:border-0">
                  <td className="px-[1.6cqw] py-[1.2cqw] font-medium">{c.name}</td>
                  <td className="px-[1.6cqw] py-[1.2cqw] text-[#6b7078]">{c.purpose}</td>
                  <td className="px-[1.6cqw] py-[1.2cqw] text-[#6b7078]">{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-[2.4cqw] rounded-[1.1cqw] bg-panel p-[1.8cqw]">
          <p className="text-[clamp(12px,1cqw,16px)] font-medium">No tracking or ad cookies</p>
          <Text className="mt-[0.5cqw]">
            We don't use third-party advertising or analytics cookies to track you across other sites. Everything
            above exists purely to make VEXO work.
          </Text>
        </div>
      </Panel>

      <SiteFooter />
    </main>
  );
}
