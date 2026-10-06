import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SiteFooter } from "@/components/organisms/SiteFooter";

const SECTIONS = [
  {
    title: "Information we collect",
    text: "When you create an account, place an order, or sign up for our newsletter, we collect your name, email address, and order details. We never collect more than we need to run your account and fulfill your orders.",
  },
  {
    title: "How we use it",
    text: "We use your information to process orders, manage your account, send order updates, and — if you've opted in — let you know about new drops and restocks. We don't sell your data to third parties.",
  },
  {
    title: "Cookies",
    text: "We use essential cookies to keep you signed in and remember your cart. See our Cookie Policy for the full breakdown of what we store and why.",
  },
  {
    title: "Your choices",
    text: "You can update your account details at any time, unsubscribe from marketing emails with one click, and request a copy or deletion of your data by contacting us.",
  },
  {
    title: "Data retention",
    text: "We keep order records for as long as your account is active, and as required for tax and accounting purposes after that.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />

      <Panel className="px-[3.4cqw] pt-[4.2cqw] pb-[3.4cqw]">
        <Eyebrow className="mb-[1.6cqw] text-[#8e939a]">Legal</Eyebrow>
        <AnimatedHeading lines={["PRIVACY", "POLICY"]} className="mb-[2cqw] text-[3.6cqw] leading-[0.95] font-medium tracking-[-0.04em]" />
        <Text className="max-w-[40cqw] max-md:max-w-none">
          Last updated October 2026. This explains what we collect when you shop with VEXO, and how we use it.
        </Text>

        <div className="mt-[2.8cqw] flex flex-col gap-[1.6cqw]">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-[1.1cqw] bg-panel p-[1.6cqw]">
              <p className="text-[clamp(13px,1.05cqw,17px)] font-medium">{s.title}</p>
              <Text className="mt-[0.5cqw]">{s.text}</Text>
            </div>
          ))}
        </div>
      </Panel>

      <SiteFooter />
    </main>
  );
}
