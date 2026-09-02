# Kleen Stripe v1, Claude Code handoff

Four files. Drop the first three into the repo, paste the fourth into Claude Code.

| File | Goes where | What it is |
| --- | --- | --- |
| `DOCTRINE.md` | repo root | The house standard, in the repo so Claude Code can read it locally instead of you re-explaining it |
| `content/kleen-stripe.json` | `content/` | The whole content layer. Every route, every fact, every line of copy, with provenance on each one |
| `content/schema.ts` | `content/` | Zod schema that enforces the doctrine at parse time |
| `CLAUDE_CODE_PROMPT.md` | anywhere, or nowhere | Paste the part below the line into Claude Code |

## What is already decided, so Claude Code does not re-decide it

- 26 routes, 23 indexable, ADA on its own page
- Full copy for the homepage, all nine service pages, all three buyer pages, about, contact,
  reviews, services hub, service areas, work, lead magnet landing, thank you and 404
- Titles and meta descriptions for every route, checked unique by the schema
- The palette, the accent rule, the ADA blue rule, and the two contrast traps yellow creates
- The signature element and the design self-critique it has to survive
- 19 source tags, declared, with the schema failing the build on an undeclared one

## What the schema refuses to let through

Em-dashes. The never_say list including "cheap" and "affordable". Superlatives without evidence.
A button labelled Submit. Booking language while `booking_url` is null. Placeholder strings that
have shipped on real client sites in this market. A duplicate title or meta description. A source
tag that is not declared. A review rendering without consent. A client name rendering without
permission.

## What a launch build does right now

It fails, on purpose, with a numbered list of every fact Devin has not confirmed. Six pending
facts, three unresolved conflicts, plus the empty photo array and the missing lead magnet. That
list is the same as the Phase 0 question list, so the build itself is the punch list.

Draft mode builds fine and is what you show Devin on the review call.

## The one thing to do before the review call

Get answers to questions 1, 6, 7, 8, 9, 10 and 12 from the Phase 0 report. Those seven unlock the
hero, the about page, the numbers strip, the footer, the schema markup and the trust band. The
other twenty can trail.
