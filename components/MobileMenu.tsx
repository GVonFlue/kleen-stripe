"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { content } from "@/lib/content";
import Cta from "@/components/Cta";

/**
 * The phone menu.
 *
 * Still a <details>, deliberately. With JavaScript off it is the one disclosure
 * pattern that opens and closes on its own, so the nav on a phone never depends on
 * a bundle arriving. Everything below is behaviour layered on top of markup that
 * already works.
 *
 * What it fixes: the App Router keeps the header mounted across a navigation, and
 * a <details> element's open state is DOM state, not React state, so nothing ever
 * cleared it. Tapping a link on an iPhone navigated to the new page with the menu
 * still hanging open over it. Three closes, because they cover different cases:
 *
 *   pathname change  the real one. Fires after the route commits, and catches a
 *                    navigation started any other way too, back gesture included.
 *   link tap         immediate, so the panel does not sit open during the
 *                    navigation, and it is the only thing that closes the menu when
 *                    the link points at the page you are already on.
 *   Escape           a keyboard user opened it; a keyboard user expects to dismiss
 *                    it without hunting for the summary again.
 */
export default function MobileMenu() {
  const { nav } = content;
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  const close = () => {
    if (ref.current) ref.current.open = false;
  };

  useEffect(close, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.open) {
        close();
        // Send focus back to the control that opened it rather than dropping it at
        // the top of the document.
        ref.current.querySelector<HTMLElement>("summary")?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <details ref={ref} className="lg:hidden">
      <summary
        aria-label={nav.menu_label}
        className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-none border border-[var(--line)]"
      >
        <span aria-hidden="true" className="text-lg">
          ☰
        </span>
      </summary>
      <div className="on-asphalt absolute inset-x-0 top-full border-b border-[var(--line)] px-4 py-4 shadow-lg">
        <nav aria-label={nav.menu_nav_label} className="flex flex-col gap-3">
          {nav.primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="py-1 text-base font-medium text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
          <span className="mt-2 block sm:hidden">
            <Cta
              label={nav.cta.label}
              href={nav.cta.href}
              variant="primary"
              onClick={close}
              className="w-full"
            />
          </span>
        </nav>
      </div>
    </details>
  );
}
