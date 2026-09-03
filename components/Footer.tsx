import Link from "next/link";
import { content } from "@/lib/content";
import { telHref, smsHref } from "@/lib/render";
import TapLink from "@/components/TapLink";

/**
 * Compliance footer. Black band, the last chapter break on the page. Social icons
 * are withheld entirely because both business.social fields are null right now:
 * doctrine hard stop 10 says every social icon must point at a real profile, so an
 * icon with nothing behind it does not render rather than pointing nowhere. The
 * fine print below is a bare copyright line rather than a restated tenure claim:
 * "Striping X lots for Y years" is marketing copy, and marketing copy does not get
 * composed in JSX even when every value inside it is real. That claim already has
 * a home, the hero.
 */
export default function Footer() {
  const { business, nav } = content;

  return (
    <footer className="bg-[var(--ink)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-[var(--surface)]">{business.name}</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--surface)]/70">{business.service_area_statement}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-col">
          {nav.primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center text-sm text-[var(--surface)]/80 hover:text-[var(--surface)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-start">
          <TapLink href={telHref(business.phone_primary)} label={`${nav.call_label} ${business.phone_display}`} size="large" onDark />
          {business.sms_enabled && (
            <TapLink href={smsHref(business.phone_primary)} label={`${nav.text_label} ${business.phone_display}`} size="small" onDark />
          )}
          <a
            href={`mailto:${business.email}`}
            className="flex min-h-11 items-center text-sm text-[var(--surface)]/80 hover:underline"
          >
            {business.email}
          </a>
        </div>
      </div>

      <div className="border-t border-[var(--surface)]/20">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-[var(--surface)]/60">
          {"©"} {new Date().getFullYear()} {business.name}. {business.city}, {business.state}.
        </div>
      </div>
    </footer>
  );
}
