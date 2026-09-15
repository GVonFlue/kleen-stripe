"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import Cta from "@/components/Cta";

/**
 * The quote form. Every "Get a quote" button on every route lands here, so this is
 * the one component on the site that has to work on the worst device, the worst
 * connection and with JavaScript off.
 *
 * Progressive enhancement, not a JS form with a fallback bolted on. The markup is a
 * plain <form method="post" action="/api/lead">, which the route already answers
 * with a 303 to /thank-you/ when the request does not ask for JSON. Everything the
 * client does on top of that is optional: it posts the same FormData with an
 * Accept: application/json header, swaps the form for the success state in place,
 * and never leaves the page. Turn JS off and the identical form still submits and
 * still lands on the thank-you route.
 *
 * Two anti-spam measures, both server-enforced in lib/lead.ts and both mirrored
 * here so the client sends what the server checks:
 *
 *   company_website  a honeypot. Off-screen rather than display:none, because a
 *                    fair number of bots skip hidden inputs and fill the rest.
 *                    aria-hidden and tabIndex -1 keep it away from screen readers
 *                    and the tab order, so it costs a real visitor nothing.
 *   rendered_at      epoch ms. The server drops anything submitted faster than a
 *                    person could type. Set on mount so it reflects when this
 *                    visitor actually saw the form rather than when the page was
 *                    built; the server-rendered default is a stale build-time value,
 *                    which is safe because the check only ever rejects submissions
 *                    that are too fast.
 *
 * Mobile specifics, which is most of his traffic: every control is at least 44px,
 * the inputs are 16px because anything smaller makes iOS Safari zoom the viewport
 * on focus and it never zooms back, and inputMode and autoComplete are set so the
 * phone shows a number pad and offers the visitor's own details rather than making
 * them type an address one thumb at a time.
 *
 * Copy comes from content.ui and the page's own form_source_tag. Nothing a visitor
 * reads is written in this file.
 */

type State = "idle" | "sending" | "sent" | "error";
type Variant = "quote" | "checklist";

export default function LeadForm({
  sourceTag,
  consentLine,
  variant = "quote",
  className = "",
}: {
  sourceTag: string;
  consentLine?: string | null;
  variant?: Variant;
  className?: string;
}) {
  const ui = content.ui;
  const [state, setState] = useState<State>("idle");
  const [download, setDownload] = useState<string | null>(null);
  const renderedAt = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renderedAt.current) renderedAt.current.value = String(Date.now());
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // No preventDefault until we know we can take over: if fetch is missing the
    // browser should be allowed to do the ordinary thing.
    if (typeof fetch !== "function") return;
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const body = await res.json().catch(() => ({ ok: res.ok }));
      if (typeof body.download === "string") setDownload(body.download);
      setState(res.ok && body.ok !== false ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    // The checklist has something to hand over the moment it is asked for, so it
    // hands it over here rather than promising an email the visitor then waits on
    // and possibly never sees. The email still goes out separately; this is what
    // stops them sitting on a thank-you screen wondering.
    const isDownload = download !== null;
    return (
      <div
        role="status"
        className={`border-[3px] border-[var(--accent)] p-6 sm:p-8 ${className}`}
      >
        <p className="text-[length:var(--text-h3)] font-black leading-tight text-[var(--ink)]">
          {isDownload ? ui.form_download_heading : ui.form_success_heading}
        </p>
        {/* business.quote_turnaround is still null, so the quote path says what
            arrives and deliberately never says how fast. Doctrine section 5: a
            success state does not invent a response time. */}
        <p className="mt-3 text-[var(--ink)]/75">
          {isDownload ? ui.form_download_body : ui.form_success_body}
        </p>
        {isDownload && (
          <div className="mt-5">
            <Cta label={ui.form_download_label} href={download as string} variant="primary" />
          </div>
        )}
      </div>
    );
  }

  const field =
    "mt-1.5 block min-h-12 w-full rounded-[2px] border-2 border-[var(--ink)]/25 bg-[var(--surface)] px-3.5 py-2.5 text-base text-[var(--ink)] outline-none transition-colors focus:border-[var(--ink)]";
  const label = "block text-sm font-semibold text-[var(--ink)]";
  const optional = "ml-1.5 font-normal text-[var(--ink)]/50";
  const isChecklist = variant === "checklist";

  return (
    <form
      method="post"
      action="/api/lead"
      onSubmit={onSubmit}
      className={`grid gap-5 ${className}`}
    >
      <input type="hidden" name="source_tag" value={sourceTag} />
      <input type="hidden" name="rendered_at" ref={renderedAt} defaultValue={String(Date.now())} />

      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`company_website-${variant}`}>Company website</label>
        <input id={`company_website-${variant}`} name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className={label} htmlFor={`lead-name-${variant}`}>
          {ui.form_name_label}
        </label>
        <input
          id={`lead-name-${variant}`}
          name="name"
          type="text"
          required
          autoComplete="name"
          autoCapitalize="words"
          className={field}
        />
      </div>

      {isChecklist ? (
        <>
          {/* Email is required here and only here. It is the thing being traded
              for, so asking for it is the transaction rather than a toll. */}
          <div>
            <label className={label} htmlFor={`lead-email-${variant}`}>
              {ui.form_email_label}
            </label>
            <input
              id={`lead-email-${variant}`}
              name="email"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
              className={field}
            />
          </div>

          <div>
            <label className={label} htmlFor={`lead-phone-${variant}`}>
              {ui.form_phone_label}
              <span className={optional}>{ui.form_optional_note}</span>
            </label>
            <input
              id={`lead-phone-${variant}`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={field}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className={label} htmlFor={`lead-phone-${variant}`}>
              {ui.form_phone_label}
            </label>
            <input
              id={`lead-phone-${variant}`}
              name="phone"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              className={field}
            />
          </div>

          <div>
            <label className={label} htmlFor={`lead-email-${variant}`}>
              {ui.form_email_label}
              <span className={optional}>{ui.form_optional_note}</span>
            </label>
            <input
              id={`lead-email-${variant}`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
              className={field}
            />
          </div>

          {/* The three qualifying fields, all optional. A lead that arrives as a
              name and a number is still a lead, and a required field is the most
              reliable way to lose one from somebody standing in a lot on a phone.
              Devin gets address, size and urgency when the visitor is willing. */}
          <div>
            <label className={label} htmlFor={`lead-address-${variant}`}>
              {ui.form_address_label}
              <span className={optional}>{ui.form_optional_note}</span>
            </label>
            <input
              id={`lead-address-${variant}`}
              name="property_address"
              type="text"
              autoComplete="street-address"
              className={field}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor={`lead-stalls-${variant}`}>
                {ui.form_stalls_label}
                <span className={optional}>{ui.form_optional_note}</span>
              </label>
              <input
                id={`lead-stalls-${variant}`}
                name="stall_count"
                type="text"
                inputMode="numeric"
                className={field}
              />
            </div>

            <div>
              <label className={label} htmlFor={`lead-timing-${variant}`}>
                {ui.form_timing_label}
                <span className={optional}>{ui.form_optional_note}</span>
              </label>
              <select id={`lead-timing-${variant}`} name="timing" className={field} defaultValue="">
                <option value="" />
                {ui.form_timing_options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={label} htmlFor={`lead-message-${variant}`}>
              {ui.form_message_label}
              <span className={optional}>{ui.form_optional_note}</span>
            </label>
            <textarea id={`lead-message-${variant}`} name="message" rows={4} className={`${field} min-h-[120px]`} />
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Cta
          label={
            state === "sending"
              ? ui.form_sending_label
              : isChecklist
                ? ui.checklist_submit_label
                : ui.form_submit_label
          }
          variant="primary"
          type="submit"
          disabled={state === "sending"}
        />
        {state === "error" && (
          <p role="alert" className="text-sm font-semibold text-[var(--ink)]">
            {ui.form_error_note}
          </p>
        )}
      </div>

      {consentLine && <p className="text-sm text-[var(--ink)]/60">{consentLine}</p>}
    </form>
  );
}
