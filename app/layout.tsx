import type { Metadata } from "next";
import "./globals.css";
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
    `}`;

  return (
    <html lang="en">
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
