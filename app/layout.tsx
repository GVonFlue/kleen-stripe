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
import JsonLd from "@/components/JsonLd";
import { siteGraph } from "@/lib/schema-org";
import { SITE_ORIGIN, IS_CANONICAL_HOST } from "@/lib/site";

const home = content.pages["/"];

/**
 * metadataBase is what makes every canonical and every og:url absolute, and it
 * resolves per deployment (lib/site.ts). Without it the audit pass found the
 * preview shipping no canonical at all while kleenstripe.com was live, which is
 * the setup where a preview deploy starts outranking the client.
 *
 * `robots` is the other half of that: any host that is not the primary domain
 * carries a site-wide noindex, so the preview cannot be indexed even by a crawler
 * that reached a URL without reading robots.txt first.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: home.title,
  description: home.meta_description ?? undefined,
  alternates: { canonical: "/" },
  robots: IS_CANONICAL_HOST ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: content.business.name,
    title: home.title,
    description: home.meta_description ?? undefined,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
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
    // The access-aisle field. It cannot use .on-asphalt or a bare var(--ada):
    // inside a dark band --ada is repointed to ada_on_dark (#5B94FF), which is a
    // light blue for text and icons on black and is the wrong colour for a full
    // field, and white type on it would fail AA. So this class pins the real ADA
    // blue as its own background and repoints --surface to white, because
    // .stall-hatch draws the hatching from --surface and the hatching on a real
    // access aisle is white.
    `.ada-field{--surface:#FFFFFF;--ink:${c.asphalt_ink};--line:rgb(255 255 255 / 30%);` +
    `background:${c.ada};color:${c.asphalt_ink};}` +
    `.on-asphalt{--surface:${c.asphalt};--subtle:${c.asphalt_raised};` +
    `--line:${c.asphalt_line};--ink:${c.asphalt_ink};--ada:${c.ada_on_dark};` +
    `background:${c.asphalt};color:${c.asphalt_ink};}`;

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: paletteVars }} />
        <JsonLd data={siteGraph()} />
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
