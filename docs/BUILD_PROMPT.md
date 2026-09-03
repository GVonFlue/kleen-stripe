# Kleen Stripe build prompt

Paste everything below the line into Claude Code, run from `~/Documents/kleen-stripe`.

---

Build the Kleen Stripe website. Next.js, Tailwind, content-driven, mobile first.

## Read first

`CLAUDE.md`, then `docs/DOCTRINE.md`, then `content/kleen-stripe.json` and `content/schema.ts`.
`docs/CLAUDE_CODE_PROMPT.md` has the architecture detail, route list and checkpoints. Do not write
a component until you have read them. The content file is the source of truth and no
visitor-facing string gets typed into JSX.

## The reference build

**https://gvonflue.vercel.app** is the house build. Go look at it before you design anything. It
is Garrett's own site and it is the shape our client sites take. Take the structure, not the
subject matter. Real estate is not parking lots.

What to carry over:

1. **A short declarative hero with one italicised word**, then a plain second line that undercuts
   the industry norm. Garrett's is "Relationship First Real *Estate*." over "No suit. No jargon.
   Just keys." Two CTAs, one give and one direct, and a real proof number sitting right underneath
   ("120+ families guided home, and counting").
2. **A named assistant in its own section, in the top third**, in the page body, not a floating
   bubble. Garrett's is Scout, presented with three short claims and a "Let's go" button. Ours is
   Chalk, after the chalk line you snap to get a straight line. For v1 Chalk is a deterministic
   scripted qualifier, not a language model. It cannot hallucinate a price and it cannot claim an
   appointment is booked, because there is no calendar behind it.
3. **A four-step journey band.** Garrett's is Pre-Approval, House Shopping, Under Contract, Move-in
   Day. Ours is the job: walk the lot, quote, stripe, walk it with you. Propose the four steps and
   show me before you build them.
4. **Three side-by-side blocks** in the middle: who you are working with, why people pick us, and
   the systems side. Garrett's third column sells ProyTech. Ours does not, so replace that third
   column with something true of Kleen Stripe and tell me what you chose and why.
5. **The lead magnet as a real form with a benefit list**, and a button that states the outcome.
   Garrett's is "Send me the guide" under six bullets. Ours is the ADA walk-around checklist, and
   the six bullets are already written in `content.lead_magnet.value_stack`.
6. **One signature section that only this business could run.** Garrett has DuckWichita. Kleen
   Stripe has three generations since 1979 and a client list most striping outfits in Kansas
   cannot touch. Build the equivalent, do not copy the duck.
7. **A closing CTA with two buttons, then a compliance footer.**

What to change, deliberately:

- **Palette.** Garrett's site is one strong accent, #1338DE, on a lot of white. Keep that
  discipline, one accent doing all the work with real whitespace around it, but the accent is
  Devin's yellow, not blue. Read `brand.color_rules` first. Yellow on white and white on yellow
  both fail WCAG AA, so every yellow surface carries ink text. Blue on this site means ADA and
  nothing else, the way blue means ADA on a real lot.
- **Buyer.** Garrett sells to first-time homebuyers, so his site is warm and reassuring. Devin
  sells to property managers, paving contractors and warehouse operators. Same plain-spoken voice,
  less hand-holding, more evidence. The "I text back. Actually." energy is exactly right. The
  first-time-buyer softness is not.
- **The hero line.** The content file currently reads "Fresh lines on your lot, from the Wichita
  family that has been striping them since 1979." That is accurate but it is not the reference's
  two-part shape. Propose a punchier version in that shape as a change to
  `pages./.blocks.hero`, show me both, and do not commit the change until I pick.

## The client, in short

Devin Hammann, Kleen Stripe, Wichita Kansas. Parking lot striping and maintenance. His grandfather
Max started it in 1979, Devin took over in 2017, third generation. Call or text (316) 617-0352,
kleenstripewichita@gmail.com. Wichita and all of Kansas, travels to Tulsa, Kansas City and
Oklahoma City.

Nine services: striping, ADA compliance, sealcoating, crack sealing and pothole repair, restriping
and new layouts, warehouse and interior striping, signage and bumper blocks, power washing, and
maintenance programs. **ADA gets its own page** and it is the highest-intent page on the site,
because that buyer is not shopping, they are exposed.

Four buyers, and they need different copy: commercial property managers, paving and construction
contractors, warehouse operators, small business owners with a dozen stalls out front.

He wants clean, bold, family-run. Straight-talking, professional, a little funny. His words for
the look were "simple to the point but look good to the eye with the catch colors and word
blocks." His competition in Wichita is EverLine Coatings, a national franchise. The whole bet of
this site is that a franchise beats him on price but cannot touch forty-seven years and a family
name.

Everything else, including full copy for all 26 routes, is already written in
`content/kleen-stripe.json`. Use it. Do not rewrite copy that is already there unless you are
proposing a change and showing me both versions.

## Rules that will fail your build if you break them

- No visitor-facing copy in JSX. It all comes from the content file.
- Never invent a fact. A `null` means we do not know, and the section withholds itself. Do not fill
  one with something plausible.
- No stock photography. Devin was explicit. Every image is a labelled placeholder that renders in
  draft and hard-fails a launch build.
- No em-dashes. No "cheap", no "affordable", no superlatives without evidence. The schema rejects
  all of them.
- Nothing says booked, confirmed, scheduled, held or on the calendar. There is no calendar.
- One primary action per screenful, and the accent colour is reserved for it. It never appears on
  decoration.
- Two or more distinct conversion paths on every route, tappable phone in header and footer, and a
  closing CTA before the footer. Every route, no exceptions.
- Tap-to-call and tap-to-text prominent on mobile. He asked for call and text specifically. Tell
  me which one you made the larger button and why.

## Build it

Work through the three checkpoints in `docs/CLAUDE_CODE_PROMPT.md` and report at each. Carry on
through a checkpoint if your report has no decisions in it. Stop and wait only when you have a
real DECISIONS I NEED FROM YOU block, numbered, most consequential first, lettered options with a
recommendation.

Before you call it done, these all have to pass and I want the real output, not a summary:

```
npm run content:verify      draft clean, launch showing its twelve blockers
npm run content:selftest    all fourteen negative tests
npm run build               draft build, no errors
npm run audit               definition-of-done audit against RENDERED html
npm run audit:selftest      every check in audit.mjs proven able to fail
npm run check:render        real Chromium, every route, 320 / 375 / 390
```

`npm run build:launch` is supposed to fail right now, with twelve blockers covering the facts
Devin has not confirmed. Do not work around it and do not remove entries from
`provenance.pending_confirmation` to make it pass.

## Report

Decisions first if you have any. Then the command output, then what is not built and who it is
blocked on, then the written design self-critique the doctrine requires: would you have built this
same site for any other striping company, and if so what did you change after asking. Also confirm
in writing that you checked the three AI design tells in `brand.ai_tells_checked`, and say where
you had to guess.

Do not tell me it is green when it is only green in draft mode.

## Shipping, only when I say so

Do not create a GitHub repo or deploy to Vercel in this session unless I ask. When I do: private
repo under the GVonFlue org, Vercel preview only, no production deploy, no custom domain, no DNS.
Both Kleen Stripe domains are unresolved and one of them may be owned by a third-party vendor.
