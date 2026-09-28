import Link from "next/link";
import { Panel } from "@/components/atoms/Panel";
import { Text } from "@/components/atoms/Text";
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading";
import { SubscribeForm } from "@/components/molecules/SubscribeForm";
import { FooterColumn } from "@/components/molecules/FooterColumn";
import { footerColumns } from "@/lib/content";

export function SiteFooter() {
  return (
    <Panel as="footer" background="bg-[#121212]" className="px-[4cqw] pt-[4.5cqw] text-[#e9ebed]">
      <div className="grid gap-[6cqw] md:grid-cols-[1.3fr_2fr]">
        <div>
          <AnimatedHeading onDark lines={["JOIN THE VEXO", "CLUB"]} className="mb-[1.6cqw] text-[3.35cqw] leading-[0.92] font-medium tracking-[-0.04em]" />
          <Text className="max-w-[26cqw] text-[#9a9ea5] max-md:max-w-none">
            New drops, restocks and training edits, straight to your inbox. No spam, just gear.
          </Text>
          <SubscribeForm />
        </div>
        <div className="grid grid-cols-3 gap-[2cqw]">
          {footerColumns.map((c) => <FooterColumn key={c.title} {...c} />)}
        </div>
      </div>

      <AnimatedHeading
        as="p"
        onDark
        lines={["VEXO"]}
        className="mt-[4cqw] text-center text-[27cqw] leading-[0.78] font-extralight tracking-[-0.02em] whitespace-nowrap [font-stretch:125%]"
      />

      <div className="flex justify-between border-t border-[#2a2a2a] pt-[1.4cqw] pb-[1.8cqw] text-[clamp(10px,0.8cqw,13px)] text-[#7d8189]">
        <span>© 2026 VEXO. All rights reserved.</span>
        <nav aria-label="Legal" className="flex gap-[2.2cqw]">
          <Link href="#">Privacy</Link><Link href="#">Terms</Link><Link href="#">Cookies</Link>
        </nav>
      </div>
    </Panel>
  );
}
