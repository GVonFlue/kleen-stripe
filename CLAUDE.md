# Kleen Stripe

Client website for Devin Hammann, Kleen Stripe, Wichita KS. Parking lot striping and maintenance.
Built by ProyTech to the ProyTech Website Build Doctrine.

## Read these before writing anything

1. `docs/DOCTRINE.md` is the house standard. Where it conflicts with the scope in
   `docs/CLAUDE_CODE_PROMPT.md`, the scope wins and you flag the conflict. Where it conflicts with
   your instincts about what looks good, the doctrine wins.
2. `content/kleen-stripe.json` is the content layer. Every fact, every route, every line of copy,
   with the provenance of each one. It is the source of truth.
3. `content/schema.ts` is the Zod schema. It enforces the doctrine at parse time. Read the
   refinements. They tell you what the build will refuse to compile.
4. `docs/BUILD_PROMPT.md` is the kickoff brief. It includes the reference build at
   https://gvonflue.vercel.app, which is the house shape our client sites take. Go look at it.
5. `docs/CLAUDE_CODE_PROMPT.md` is the architecture detail: stack, route list, build order and
   checkpoints.

## Hard rules

- **No copy in JSX. None.** Every string a visitor can read comes from the content file through
  the parsed schema. This site feeds ProyTech's client self-edit portal, so a hardcoded string is
  a defect, not a shortcut.
- **Never invent a fact.** A null means we do not know. The section withholds itself. Do not fill
  a null with something plausible, do not source one from a competitor, do not write a number from
  memory. Doctrine hard stop 1.
- **No stock photography.** Devin was explicit. Images are labelled `PhotoSlot` placeholders that
  render in draft and hard-fail a launch build.
- **No em-dashes.** The schema rejects them.
- **Nothing says booked, confirmed, scheduled, held or on the calendar.** There is no calendar.
  `endpoints.booking_url` is null and the audit fails the build on any of those strings.
- **No secrets in the repo, git history included.** Keys live in the host environment.
- **Do not touch DNS.** The domain situation is unresolved and one of the two domains may be owned
  by a third-party vendor.

## The launch build is supposed to fail

`npm run build:launch` runs the strict audit and currently reports fourteen blockers: eight facts
Devin has not confirmed (six from Phase 0, plus the differentiators band's price-promise framing
from checkpoint 1, plus the four area pages' shared template from checkpoint 2, both pending his
sign-off), three conflicting facts, an empty photo array and a missing lead magnet. That list is
the client question list. Do not remove entries from `provenance.pending_confirmation` to make it
pass, and do not report the build green when it is only green in draft mode. Doctrine hard stop 8.

`npm run dev` and `npm run build` run in draft mode and are clean.

## Commands

```
npm run dev                 draft mode, local
npm run build               draft build
npm run build:launch        strict build, currently fails on purpose
npm run content:verify      parse the content layer, print draft and launch audits
npm run content:selftest    negative-test every check in the auditor
npm run audit               definition-of-done audit against rendered HTML
npm run audit:selftest      negative-test every check in audit.mjs
npm run check:render        real Chromium: console, overflow, tap targets, contrast, no-JS
```

`scripts/` does not exist yet. Building it is checkpoint 3.

## How to work here

Build in phases and report at each checkpoint. Open every report with DECISIONS I NEED FROM YOU,
numbered, most consequential first, as lettered options with a recommendation. Say what is not
built and who it is blocked on. A report that only contains good news is a report nobody can act
on. Doctrine section 11.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
