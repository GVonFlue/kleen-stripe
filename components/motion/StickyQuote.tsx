"use client";

import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { telHref } from "@/lib/render";

/**
 * A call and text bar that rises once the hero has scrolled past, on phones only.
 *
 * His buyers are standing in a parking lot looking at the thing they want quoted,
 * so the two doors that actually get used should never be more than a thumb away.
 * Hidden on desktop, where the header already carries both and a fixed bar would
 * just eat screen.
 *
 * Renders nothing until scrolled, so it never covers the hero, and it sits above
 * the safe-area inset so it clears the home indicator on a modern phone.
 */
export default function StickyQuote() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tel = telHref(content.business.phone_primary);
  const sms = `sms:+1${content.business.phone_primary}`;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        transform: show ? "translateY(0)" : "translateY(110%)",
        transition: "transform 280ms cubic-bezier(0.2,0,0.2,1)",
      }}
      aria-hidden={!show}
    >
      <div className="flex border-t-[3px] border-[var(--accent)] bg-[var(--asphalt)]">
        <a
          href={tel}
          tabIndex={show ? 0 : -1}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 text-base font-semibold text-[var(--asphalt-ink)]"
        >
          {`Call ${content.business.phone_display}`}
        </a>
        <a
          href={sms}
          tabIndex={show ? 0 : -1}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 bg-[var(--accent)] text-base font-semibold text-[var(--accent-ink)]"
        >
          Text a photo
        </a>
      </div>
    </div>
  );
}
