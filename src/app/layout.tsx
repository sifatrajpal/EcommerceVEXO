import type { Metadata } from "next";
import { Archivo, Jost, Gilda_Display, Oswald, Fraunces } from "next/font/google";
import { getActiveTheme } from "@/lib/data/settings";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });
// Loaded for the admin-selectable themes (Admin → Theme) — unused CSS vars when Default is active.
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });
const gildaDisplay = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--font-gilda" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "VEXO — Gear Up Every Season",
  description: "Performance workout wear for every season and every rep.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getActiveTheme();

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${archivo.variable} ${jost.variable} ${gildaDisplay.variable} ${oswald.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before paint: enables the "hidden until animated" states only when JS works */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
