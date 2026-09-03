# Kleen Stripe build prompt

**This supersedes every earlier prompt in this repo.** If an instruction here contradicts something
you were told in a previous session, this wins.

Continuing an existing Claude Code session: paste **The work order** section only.
Starting fresh: paste the whole file.

---

## Context

Read `CLAUDE.md`, then `docs/DOCTRINE.md`, then `content/kleen-stripe.json` and
`content/schema.ts`. `docs/CLAUDE_CODE_PROMPT.md` has the architecture detail and route list.
The content file is the source of truth and no visitor-facing string gets typed into JSX.

### The client

Devin Hammann, Kleen Stripe, Wichita Kansas. Parking lot striping and maintenance. His grandfather
Max started it in 1979, Devin took over in 2017, third generation. Call or text (316) 617-0352.
Wichita and all of Kansas, travels to Tulsa, Kansas City and Oklahoma City.

Nine services. **ADA compliance gets its own page** and it is the highest-intent page on the site,
because that buyer is not shopping, they are exposed. Four buyers who need different copy:
commercial property managers, paving and construction contractors, warehouse operators, and small
business owners with a dozen stalls out front.

His competition in Wichita is EverLine Coatings, a national franchise. The whole bet of this site
is that a franchise beats him on price but cannot touch forty-seven years and a family name.

### The reference build

**https://gvonflue.vercel.app** is the house shape our client sites take. Structure to carry over:
short declarative hero with one italicised word over a plain undercutting line, a named assistant
in its own section in the top third, a four-step journey band, three side-by-side blocks, the lead
magnet as a real form with a benefit list and an outcome-stated button, one signature section only
this business could run, closing CTA, compliance footer.

Palette discipline carries over, one accent doing all the work with real whitespace. The accent is
Devin's yellow, not Garrett's blue. Read `brand.color_rules` first: yellow on white and white on
yellow both fail WCAG AA, so every yellow surface carries ink text. Blue on this site means ADA
and nothing else.

Garrett sells to first-time homebuyers so his site is warm and reassuring. Devin sells to property
managers and paving contractors. Same plain-spoken voice, less hand-holding, more evidence. The
"I text back. Actually." energy is right. The softness is not.

### Rules that fail the build

- No visitor-facing copy in JSX.
- Never invent a fact. A `null` means we do not know and the section withholds itself.
- No stock photography.
- No em-dashes, no "cheap", no "affordable", no superlatives without evidence.
- Nothing says booked, confirmed, scheduled, held or on the calendar. There is no calendar.
- One primary action per screenful. The accent colour is reserved for it and never decorates.
- Two or more distinct conversion paths on every route, tappable phone in header and footer,
  closing CTA before the footer. Every route.

### Already settled, do not reopen

- **Hero:** "Striping Wichita Lots Since *1979*." over "No call center. You get Devin." Built and
  approved. `Family Run Lot Striping.` is the fallback when `founded_year` is unconfirmed.
- **Journey band:** built and approved. Step 2 is "One number, not a range that grows later,"
  which deliberately does not contradict the small-business page.
- **Checkpoint 1** is complete: scaffold, content parsing, route registry, layout, header, footer,
  palette, PhotoSlot, homepage.
- Numbering stays on the journey band only, because that is genuinely sequential.

---

## The work order

Three things, in this order. **Do not restyle the site from scratch.** Checkpoint 1 is solid and
matches the reference. We are escalating it, not replacing it.

### 1. Photos first

Devin owns the roughly 17 photos on https://kleenstripereviews.com/imagery and we have permission
to use them.

- Download to `public/photos/source/`. Do not hotlink that CDN, the Duda account's ownership is
  unresolved and if it lapses every image goes with it.
- Strip all EXIF, GPS above all. Permission to use his photos is not permission to publish his
  customers' addresses.
- Write real alt text from what you can see in each image. Describe the lot, not the business.
- Flag anything that reads as vendor stock rather than a real job photo. A vendor built that site
  and Devin may not know what they added. List them, do not delete them.
- `gallery[].consent = true`. These are **not** pending confirmation. They render in draft and in
  launch. Add `gallery[]` to the schema for singles: `{ id, src, alt, lot_type, caption, consent }`.
  `work[]` stays for real before and after pairs.
- Fill the hero slot and the trust slot. If nothing shows Devin or the crew, leave the trust slot
  as a placeholder and say so rather than substituting a lot photo for a people photo.
- `/work/` comes off `noindex` and goes into the sitemap. Change the audit rule from "`work[]` is
  non-empty" to "`gallery[]` or `work[]` has a consented item," negative-tested both directions.
- The LAUNCH blocker on `work[]` **stays**. Those are before and after pairs and these are single
  afters.
- `next/image`, AVIF and WebP, real `sizes`, lazy below the fold.

**Stop here and show me the homepage with real photos before you touch motion.** It may need less
animation than I think once it has images in it.

### 2. The motion system

This site should feel one of a kind. It should not feel like every AI-built site in 2026, which
means no fade-up-on-scroll on every card, no parallax, no scroll-jacking, no scattered decorative
motion. Doctrine section 6 names that as an AI tell.

For a striping company the motion **is the product**. Paint going down. Build these in order:

**a. The painted line.** SVG `stroke-dashoffset` driven by IntersectionObserver. Section dividers
and heading underlines paint left to right as they enter view, at the speed a striping machine
moves. This is the backbone and it appears on every route.

**b. StallGrid**, the signature element already specced in `brand.signature_element`. Hand-authored
SVG of a real lot layout. Stalls fill as you scroll, the ADA stall and its access aisle land last
and land in the blue. Doubles as the section progress indicator. Build it by hand, no chart
library.

**c. The hero reveal.** One idea done well. A stripe-shaped mask sweeps across the hero photo on
load, so the image is revealed the way a lot gets painted. Under 700ms. It must never delay LCP:
the image is in the DOM and painted first, the mask is enhancement.

**d. Chalk's snap.** When the assistant opens, the chalk line snaps taut before the panel appears.
Small, once, not repeated.

**Do not animate** service cards, the door band, body copy, testimonials, the numbers strip, or
anything else generic. If a section would get the same animation on a plumber's site, it does not
get one here.

Non-negotiable:

- `prefers-reduced-motion` honored **twice**. A CSS media query that kills every animation, and JS
  that renders final values immediately. The DOM correct on first paint either way. Negative-test
  it: assert the reduced-motion path renders the final state.
- No animation ever gates usability. Content readable and clickable before, during and after.
- No scroll-jacking and no hijacked scroll speed. It breaks on phones and his buyers are standing
  in a parking lot.
- Lighthouse Performance 90+ on **mobile** still applies. If a motion idea costs that, the motion
  loses.
- **No animation library by default.** CSS transforms, SVG and IntersectionObserver cover all of
  the above. If one earns its bundle weight, propose it with the measured cost and let me decide.
  Do not just install it.

### 3. Checkpoint 2

Build the motion primitives as reusable components **before** the remaining 25 routes, so the
routes inherit them instead of being retrofitted. Then build the routes.

---

## Report

Decisions first if you have any, numbered, most consequential first, lettered options with a
recommendation. Then:

- Lighthouse mobile, measured on the deploy, **before and after** the motion work. I want to see
  what it cost.
- `check-render.mjs` at 320 / 375 / 390. Mobile is still completely unverified and this does not
  go to the client until it is.
- The reduced-motion negative test, proven able to fail.
- The design self-critique, and specifically: **name every animation you built and say why it
  could not appear on a competitor's site.** Anything that fails that test, cut it.

Do not tell me it is green when it is only green in draft mode. Do not describe intended behavior
as completed behavior.

## Not this session

No GitHub changes and no production deploy unless I ask. Preview only, no custom domain, no DNS.
