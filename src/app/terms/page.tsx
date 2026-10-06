import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SiteFooter } from "@/components/organisms/SiteFooter";

const SECTIONS = [
  {
    title: "Using our site",
    text: "By placing an order or creating an account, you agree to these terms. You must be able to form a legally binding contract to buy from us, and the details you give us must be accurate.",
  },
  {
    title: "Orders and pricing",
    text: "All prices are shown in USD and may change without notice. We reserve the right to cancel or limit any order, including ones that appear to be placed by resellers or that have a pricing error.",
  },
  {
    title: "Shipping and returns",
    text: "Delivery times are estimates, not guarantees. See our Shipping and Returns pages for the full policies that apply to every order.",
  },
  {
    title: "Account responsibility",
    text: "You're responsible for keeping your account credentials secure and for any activity that happens under your account.",
  },
  {
    title: "Intellectual property",
    text: "All product designs, photography, and site content belong to VEXO and may not be reproduced without permission.",
  },
];

export default function TermsPage() {
  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />

      <Panel className="px-[3.4cqw] pt-[4.2cqw] pb-[3.4cqw]">
        <Eyebrow className="mb-[1.6cqw] text-[#8e939a]">Legal</Eyebrow>
        <AnimatedHeading lines={["TERMS OF", "SERVICE"]} className="mb-[2cqw] text-[3.6cqw] leading-[0.95] font-medium tracking-[-0.04em]" />
        <Text className="max-w-[40cqw] max-md:max-w-none">
          Last updated October 2026. The basics of shopping with VEXO — please read before placing an order.
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
