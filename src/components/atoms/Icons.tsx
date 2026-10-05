import type { SVGProps } from "react";

const base = { viewBox: "0 0 24 24", fill: "none", strokeWidth: 2, "aria-hidden": true } as const;

export const BagIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}><rect x="5" y="9" width="14" height="12" rx="3" /><path d="M9 9V7a3 3 0 0 1 6 0v2" /></svg>
);
export const HeartIcon = ({ filled, ...p }: SVGProps<SVGSVGElement> & { filled?: boolean }) => (
  <svg {...base} stroke="currentColor" fill={filled ? "currentColor" : "none"} {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
);
export const ChevronRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}><path d="M9 6l6 6-6 6" /></svg>
);
export const ChevronDownIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}><path d="M6 9l6 6 6-6" /></svg>
);
export const ArrowUpRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}><path d="M7 17L17 7M9 7h8v8" /></svg>
);
export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 10 12" aria-hidden {...p}><path d="M0 0l10 6-10 6z" fill="currentColor" /></svg>
);

export const GoogleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 18 18" aria-hidden {...p}>
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l3-2.33z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
  </svg>
);

export const AppleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden {...p}>
    <path d="M13.1 9.5c0-1.86 1.52-2.75 1.59-2.8-.87-1.27-2.22-1.45-2.7-1.47-1.15-.12-2.24.68-2.82.68-.58 0-1.48-.66-2.43-.64-1.25.02-2.4.73-3.04 1.85-1.3 2.25-.33 5.58.93 7.4.62.9 1.36 1.9 2.33 1.86.94-.04 1.29-.6 2.42-.6s1.45.6 2.44.58c1.01-.02 1.65-.9 2.27-1.8.71-1.04 1-2.05 1.02-2.1-.02-.01-1.96-.75-1.98-2.96z" />
    <path d="M11.28 3.9c.52-.63.87-1.5.77-2.37-.75.03-1.65.5-2.19 1.12-.48.55-.9 1.44-.79 2.28.83.06 1.68-.42 2.21-1.03z" />
  </svg>
);

export const XIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden {...p}>
    <path d="M10.6 7.8 16.2 1h-1.3l-4.9 5.9L6.1 1H1l5.9 8.5L1 17h1.3l5.2-6.2L11.9 17H17l-6.4-9.2zM8.7 10l-.6-.9L2.9 2h2l3.9 5.6.6.9 5.1 7.3h-2L8.7 10z" />
  </svg>
);

export const StarIcon = ({ filled, ...p }: SVGProps<SVGSVGElement> & { filled?: boolean }) => (
  <svg viewBox="0 0 20 20" aria-hidden fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.4} {...p}>
    <path d="M10 1.6l2.47 5.15 5.53.68-4.1 3.9 1.1 5.57L10 14.1l-4.99 2.8 1.1-5.57-4.1-3.9 5.52-.68z" strokeLinejoin="round" />
  </svg>
);

export const FacebookIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden {...p}>
    <path d="M11.5 3.5H13V1.14A19.4 19.4 0 0 0 10.9 1C8.7 1 7.2 2.32 7.2 4.76v2.15H4.8v2.9h2.4V17h3.05V9.8h2.4l.38-2.9h-2.78V5.03c0-.84.24-1.53 1.45-1.53z" />
  </svg>
);

export const LinkIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}>
    <path d="M9 15l6-6" />
    <path d="M8 6h-.5A3.5 3.5 0 0 0 4 9.5v0A3.5 3.5 0 0 0 7.5 13H9" />
    <path d="M16 18h.5a3.5 3.5 0 0 0 3.5-3.5v0A3.5 3.5 0 0 0 16.5 11H15" />
  </svg>
);

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
);
export const BellIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}>
    <path d="M6 10a6 6 0 1 1 12 0c0 3.3 1 5 1.5 5.5H4.5C5 15 6 13.3 6 10z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);
export const GridIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}>
    <rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" />
  </svg>
);
export const BoxIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}>
    <path d="M3 8l9-5 9 5-9 5-9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" />
  </svg>
);
export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const RefreshIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}>
    <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" /><path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" /><path d="M3 21v-5h5" />
  </svg>
);
export const LogOutIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
  </svg>
);
export const PanelLeftIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>
);
export const TrendingUpIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
);
export const UsersIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} stroke="currentColor" {...p}>
    <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6" /><path d="M18.5 20a6.3 6.3 0 0 0-4-5.9" />
  </svg>
);
