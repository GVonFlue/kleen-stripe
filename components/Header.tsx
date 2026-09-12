import Link from "next/link";
import { content } from "@/lib/content";
import { telHref, smsHref } from "@/lib/render";
import Cta from "@/components/Cta";
import Logo from "@/components/Logo";
import TapLink from "@/components/TapLink";

/**
 * Call is the larger tap target here and in the footer. business.contact_preference
 * is ["call", "text"], Devin's own confirmed order, so call gets the visual weight
 * and text sits right beside it, one tap away. Doctrine "redundant paths": tappable
 * tel: in the header on every route, one accent CTA, Hick's Law.
 */
export default function Header() {
  const { business, nav } = content;

  return (
    // The bar is asphalt on every route, not just over the dark hero. The wordmark
    // is yellow on black and a yellow-on-white header would be the one place the
    // site contradicted the logo it is built from. .on-asphalt repoints --ink,
    // --surface, --line and --ada for everything inside, so the nav, the tap
    // targets and the CTA below need no dark variants of their own.
    <header className="on-asphalt sticky top-0 z-40 border-b border-[var(--line)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center text-[var(--accent)]"
          aria-label={business.name}
        >
          <Logo variant="lockup" className="w-[132px] sm:w-[164px]" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          {nav.primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--ink)]/80 hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <TapLink href={telHref(business.phone_primary)} label={business.phone_display} size="large" />
          {business.sms_enabled && (
            // Wrapped rather than passed as TapLink's own className: Tailwind v4 gives
            // "hidden" and TapLink's own unconditional "inline-flex" equal specificity,
            // and whichever is later in the generated stylesheet wins at every width,
            // not whichever the media query says should. A wrapper element keeps the
            // responsive display toggle on a single element with nothing else competing
            // for `display` on it.
            <span className="hidden sm:inline-flex">
              <TapLink href={smsHref(business.phone_primary)} label={nav.text_label} size="small" />
            </span>
          )}
          <span className="hidden sm:inline-flex">
            <Cta label={nav.cta.label} href={nav.cta.href} variant="primary" />
          </span>
        </div>

        <details className="lg:hidden">
          <summary
            aria-label="Menu"
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-none border border-[var(--line)]"
          >
            <span aria-hidden="true" className="text-lg">
              ☰
            </span>
          </summary>
          <div className="on-asphalt absolute inset-x-0 top-full border-b border-[var(--line)] px-4 py-4 shadow-lg">
            <nav aria-label="Primary, mobile" className="flex flex-col gap-3">
              {nav.primary.map((item) => (
                <Link key={item.href} href={item.href} className="py-1 text-base font-medium text-[var(--ink)]">
                  {item.label}
                </Link>
              ))}
              <span className="mt-2 block sm:hidden">
                <Cta label={nav.cta.label} href={nav.cta.href} variant="primary" className="w-full" />
              </span>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
