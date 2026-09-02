# Paste this into Claude Code, in the repo root

---

You are building the Kleen Stripe website for ProyTech. Read these three files before you do
anything else, in this order:

1. `DOCTRINE.md` — the ProyTech Website Build Doctrine. This is the house standard. Where it
   conflicts with the scope below, the scope wins and you flag the conflict in your checkpoint
   report. Where it conflicts with your instincts about what looks good, the doctrine wins.
2. `content/kleen-stripe.json` — the content layer. Every fact, every piece of copy, every route.
   This was researched and written before you got here. It is the source of truth.
3. `content/schema.ts` — the Zod schema. It enforces the doctrine at parse time. Read the
   refinements, they tell you what the build will refuse to compile.

Do not start writing components until you have read all three.

## The client, in one paragraph

Devin Hammann runs Kleen Stripe in Wichita, Kansas. Parking lot striping, sealcoating, ADA
layouts, crack and pothole repair, signage, warehouse floor striping, power washing. His
grandfather started it in 1979 and Devin took it over in 2017, which makes him third generation.
His buyers are commercial: property managers, paving and construction contractors, warehouse
operators, and small business owners with a dozen stalls out front. His competition in Wichita is
EverLine Coatings, a national franchise. The whole strategic bet of this site is that a franchise
can beat him on price but cannot beat him on forty-seven years and a family name.

## Hard rules for this build

- **No copy in JSX. None.** Every string a visitor can read comes from `content/kleen-stripe.json`
  through the parsed schema. If you catch yourself typing a sentence into a component, it belongs
  in the content file. This site is going into ProyTech's client self-edit portal, so a hardcoded
  string is a defect, not a shortcut.
- **Never invent a fact.** A null in the content file means we do not know. The section withholds
  itself. Do not fill a null with something plausible, do not source one from a competitor's site,
  and do not write a number from memory. Doctrine hard stop 1.
- **No stock photography.** Devin was explicit. Every image is a labelled `<PhotoSlot>` that
  renders a visible placeholder in draft and hard-fails a launch build.
- **No em-dashes anywhere.** The schema rejects them. So does the audit.
- **Nothing on this site says booked, confirmed, scheduled, held or on the calendar.** There is no
  calendar integration. `endpoints.booking_url` is null and the audit fails the build if any of
  those strings appear. Doctrine section 8.
- **Do not touch DNS.** Not in scope for this session. The domain situation is unresolved and one
  of the two domains may be owned by a third-party vendor.

## Stack

- Next.js, App Router, TypeScript, deployed on Vercel.
- Tailwind, current stable, pinned.
- `trailingSlash: true`. Every route in the content file ends with a slash.
- Every page statically generated. One route handler at `/api/lead`.
- Self-host the fonts. No Google Fonts request. That is a free Lighthouse point and one less
  third-party dependency.
- No CSS-in-JS, no component library, no animation library. Tailwind and hand-written CSS
  variables for the palette.

## Architecture

```
content/
  kleen-stripe.json          the content layer, do not restructure it
  schema.ts                  the Zod schema, extend it rather than bypassing it
lib/
  content.ts                 parses once at module load, exports the typed object
  routes.ts                  builds the route registry from content
  lead.ts                    ONE capture function. Forms and the bot both call it.
app/
  layout.tsx
  page.tsx                   home
  [slug]/page.tsx            services, buyers, and area pages, off the route registry
  about/, contact/, reviews/, services/, service-areas/, work/,
  ada-striping-checklist/, thank-you/
  not-found.tsx
  api/lead/route.ts
components/
  PhotoSlot.tsx              placeholder in draft, throws in launch
  LeadForm.tsx               real <form>, works with JS disabled
  Chalk.tsx                  the on-page assistant, see below
  StallGrid.tsx              the signature element
scripts/
  audit.mjs                  definition-of-done audit against RENDERED html
  audit.selftest.mjs         negative-tests every check in audit.mjs
  check-render.mjs           real Chromium: console, overflow, tap targets, contrast, no-JS
```

`lib/content.ts` calls `parseContent(json, process.env.LAUNCH === "1" ? "launch" : "draft")`. In
launch mode the parse throws while any fact is still unconfirmed. That is deliberate. Devin has
not answered the 27 questions yet, so **a launch build is supposed to fail right now.** Do not
work around it, do not remove entries from `provenance.pending_confirmation` to make it pass, and
do not tell me the build is green when it is only green in draft mode.

`app/[slug]/page.tsx` resolves against the route registry and switches on route type. The
singleton pages get their own files.

## Routes

26 total, 23 indexable. They are all in `content/kleen-stripe.json`. `/work/` ships `noindex` and
out of the sitemap until real photographs exist. `/thank-you/` and `/404` are `noindex, follow`.

Every route needs, without exception: a unique title and meta description from the content file, a
canonical, two or more distinct conversion paths, a tappable `tel:` in header and footer, and a
closing CTA before the footer. Doctrine section 10.

## Design

The derivation is Rung 1 and Rung 2 and it is already written in `brand` in the content file.
Read `brand.color_rules` carefully, especially this one: **yellow on white and white on yellow
both fail WCAG AA.** Every yellow surface carries ink text. Blue means ADA and nothing else.

The signature element is `StallGrid`: a hand-authored SVG of a lot layout, stalls filling in as
the page scrolls, with the ADA stall and its access aisle in the blue. It doubles as the section
progress indicator. Build it by hand, do not pull in a chart library.

Before you finish, write the self-critique the doctrine requires: would you have built this same
design for any other striping company? If yes, say so and change something, then name what you
changed. Also state in writing that you checked the three AI design tells listed in
`brand.ai_tells_checked`.

## The on-page assistant

Call it **Chalk**, after the chalk line, which is the tool you snap to get a straight line. Name
subject to Devin's approval, so it comes out of the content file.

For v1 it is a **deterministic scripted qualifier, not a language model.** Two taps, then a name
and a number, then it hands off. Built this way on purpose: it works with no API key, it cannot
hallucinate a price, and it cannot claim an appointment is booked because there is no calendar
behind it and nothing in the script says otherwise. Homepage top third, in the page body, not a
floating bubble. It writes through `lib/lead.ts`, the same function the forms use. One code path.

## Lead plumbing, and what you are and are not building

The doctrine path is validate, Google Sheet, CRM, GHL. **You are building the first step only.**

Build:
- Every form as a real `<form method="post" action={FORM_ENDPOINT}>` that submits with JavaScript
  disabled. JS is enhancement: inline validation, fetch, and success shown even if the request
  fails, because a downstream failure is never the visitor's problem.
- Honeypot field `company_website`, a `rendered_at` timestamp for the minimum-time check, and an
  explicit `source_tag` on every form. The tags are declared in `content.source_tags` and the
  schema fails the build if a form uses one that is not declared.
- `/api/lead` that rejects unknown form keys, silently drops submissions under three seconds,
  stores nothing on a filled honeypot while telling the sender it succeeded, rate limits, writes
  the full payload to the log in one recoverable line, and returns a 303 carrying success state
  for the no-JS path.

Do not build, and do not claim: the Sheet write, the CRM write, the GHL handoff. Say so plainly in
the README. Doctrine hard stop 8.

`FORM_ENDPOINT` is an environment variable so it can be pointed at Formspree without a deploy.
No secrets in the repo, git history included.

## Schema.org

`LocalBusiness` sitewide, `Service` on each service page, `BreadcrumbList` everywhere, `FAQPage`
on pages that have answered FAQs.

Two things to get right:

1. **No `aggregateRating`.** There is one review on file, its consent flag is false, and inventing
   or padding an aggregate is a manual action from Google as well as a doctrine hard stop.
2. **No `address` in the markup** until `business.street_address` stops being null. There are two
   different cities for this business in public right now. Use `areaServed` from `areas[]` and
   omit the address. Note in your checkpoint that this limits rich results and that it is fixed
   the moment Devin answers question 9.

## Build order, with checkpoints

Report at each checkpoint. Open every report with **DECISIONS I NEED FROM YOU**, numbered, most
consequential first, as lettered options with a recommendation. Never bury a decision in the
middle. Doctrine section 11.

**Checkpoint 1.** Scaffold, content parsing, route registry, layout, header, footer, palette and
type scale, `PhotoSlot`, and one finished route: the homepage. Stop and report.

**Checkpoint 2.** The nine service pages, three buyer pages, four area pages, and the remaining
singletons. Stop and report.

**Checkpoint 3.** `LeadForm`, `/api/lead`, `Chalk`, `StallGrid`, schema.org, sitemap, robots,
404, then the three scripts. All three scripts must pass in draft mode before you tell me it is
done, and `audit.selftest.mjs` must prove every check in `audit.mjs` can actually fail. A passing
test that cannot fail is not a test.

## Explicitly out of scope for v1

Say so rather than building it: real photography, the ADA checklist PDF, published reviews, the
Sheet and CRM and GHL wiring, a language-model chatbot, DNS, the 301 from the second domain, and
any ADA dimension, ratio, slope or penalty figure. That last one is a copy gate, not a build task.
Every number on the ADA page has to be checked against the 2010 ADA Standards for Accessible
Design before it is written, and DOJ civil penalty maximums adjust annually, so a figure without a
current citation and date does not go on the page.

## When you are done

Write `README.md` covering the environment variables, the draft and launch build commands, how to
edit content, and an honest list of what is not built and who it is blocked on. Then give me the
self-critique and the three AI design tells in writing.

Do not mark anything green that you did not earn. Lighthouse and the Rich Results Test both need a
public URL, so they run after deploy and they are not claimed before then.
