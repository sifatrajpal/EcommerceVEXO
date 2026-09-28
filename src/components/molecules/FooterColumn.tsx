import Link from "next/link";
import type { NavItem } from "./NavLinks";

export function FooterColumn({ title, links }: { title: string; links: NavItem[] }) {
  return (
    <div>
      <h4 className="mb-[1.4cqw] text-[clamp(10px,0.8cqw,13px)] tracking-[0.02em] text-[#7d8189]">{title}</h4>
      <ul>
        {links.map((l) => (
          <li key={l.label} className="mb-[0.8cqw]">
            <Link
              href={l.href}
              className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-left-bottom bg-no-repeat text-[clamp(12px,1.1cqw,17px)] transition-[background-size] duration-300 hover:bg-[length:100%_1px]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
