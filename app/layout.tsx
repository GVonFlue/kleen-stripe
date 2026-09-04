import type { Metadata } from "next";
import { Overpass, Overpass_Mono, Public_Sans } from "next/font/google";
import "./globals.css";

/*
 * Two American public-infrastructure typefaces, chosen for this client rather than
 * for this decade. Overpass is drawn from FHWA Highway Gothic, the lettering on US
 * road signs, so the display face and the paint on the lots are the same lineage.
 * Public Sans is the US Web Design System face, which suits a site whose highest
 * intent page is about federal accessibility standards. Self-hosted by next/font,
 * so there is no Google Fonts request and no third-party dependency at runtime.
 */
const display = Overpass({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display-face",
  display: "swap",
});
const body = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
});
const mono = Overpass_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono-ks",
  display: "swap",
});
import { content } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const home = content.pages["/"];

export const metadata: Metadata = {
  title: home.title,
  description: home.meta_description ?? undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = content.brand.colors;
  // Palette comes from content/kleen-stripe.json, brand.colors. Nothing here is a
  // hardcoded hex value: this block only wires content to CSS custom properties
  // that globals.css and every component read from.
  const paletteVars =
    `:root{` +
    `--ink:${c.ink};--surface:${c.surface};--subtle:${c.subtle};` +
    `--line:${c.line};--accent:${c.accent};--accent-ink:${c.accent_ink};--ada:${c.ada};` +
    `--asphalt:${c.asphalt};--asphalt-raised:${c.asphalt_raised};` +
    `--asphalt-line:${c.asphalt_line};--asphalt-ink:${c.asphalt_ink};` +
    `--asphalt-muted:${c.asphalt_muted};--ada-on-dark:${c.ada_on_dark};` +
    `}` +
    // A dark band sets these four locally and every child reads them without
    // caring which surface it is on. One Band component flips them, so a block
    // written once renders correctly on white or on asphalt.
    `.on-asphalt{--surface:${c.asphalt};--subtle:${c.asphalt_raised};` +
    `--line:${c.asphalt_line};--ink:${c.asphalt_ink};--ada:${c.ada_on_dark};` +
    `background:${c.asphalt};color:${c.asphalt_ink};}`;

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: paletteVars }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-[var(--surface)]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
