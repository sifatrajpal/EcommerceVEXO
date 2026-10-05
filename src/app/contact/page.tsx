import { Panel } from "@/components/atoms/Panel";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { SiteHeaderBar } from "@/components/organisms/SiteHeaderBar";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { ContactForm } from "@/components/organisms/ContactForm";

const CHANNELS = [
  { label: "Email", value: "support@vexo.com" },
  { label: "Phone", value: "+1 (555) 019-2834" },
  { label: "Hours", value: "Mon–Fri, 9am–6pm EST" },
  { label: "HQ", value: "142 Ridgeview Ave, Brooklyn, NY" },
];

export default function ContactPage() {
  return (
    <main className="grid gap-2.5 p-2.5">
      <SiteHeaderBar />

      <Panel className="px-[3.4cqw] pt-[4.2cqw] pb-[3.4cqw]">
        <div className="grid gap-[4.5cqw] md:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow className="mb-[1.6cqw] text-[#8e939a]">Contact</Eyebrow>
            <AnimatedHeading
              lines={["WE'RE HERE TO", "HELP"]}
              className="mb-[2cqw] text-[3.6cqw] leading-[0.95] font-medium tracking-[-0.04em]"
            />
            <Text className="max-w-[28cqw] max-md:max-w-none">
              Questions about an order, sizing, or a partnership? Send us a message and a real human on the VEXO team
              will get back to you within 1–2 business days.
            </Text>

            <div className="mt-[2.6cqw] grid grid-cols-2 gap-[1.6cqw]">
              {CHANNELS.map((c) => (
                <div key={c.label} className="rounded-[1.1cqw] bg-panel p-[1.4cqw]">
                  <p className="text-[clamp(9px,0.78cqw,12px)] font-medium tracking-[0.04em] text-[#8e939a]">{c.label.toUpperCase()}</p>
                  <p className="mt-[0.3cqw] text-[clamp(12px,0.95cqw,15px)]">{c.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.4cqw] bg-panel p-[2.2cqw]">
            <ContactForm />
          </div>
        </div>
      </Panel>

      <SiteFooter />
    </main>
  );
}
