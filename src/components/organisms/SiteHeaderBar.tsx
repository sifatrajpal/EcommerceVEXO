import { Panel } from "@/components/atoms/Panel";
import { SiteHeader } from "./SiteHeader";

/** Standalone nav bar for every non-admin page that isn't the homepage (which overlays its own header on the hero). */
export function SiteHeaderBar() {
  return (
    <Panel background="bg-frame" className="pb-[1.6cqw]">
      <SiteHeader />
    </Panel>
  );
}
