# ProyTech Website Build Doctrine

For any Claude instance building a client website for ProyTech.
Authors of record: Garrett Von Flue and Logan Sell, Co-Founders.

Read this before you write a line of copy or a line of code. This is the house standard.
Everything in here was learned the expensive way on real client builds. Where this document
conflicts with a client's signed scope, the scope wins and you flag the conflict. Where it
conflicts with your instincts about what looks good, this document wins.

## 0. What ProyTech actually sells

We are a systems company. Not an agency, not a marketing company, not a web shop. Never use the
word "agency" in client-facing copy or conversation. It primes people to think retainer,
deliverable, replaceable.

The product is a system that catches business the client is already losing:

Website (capture) → Automations (route and nurture) → CRM (track and close) → reporting

A website that looks beautiful and captures nothing is a failed build. A plain site that catches
every hand raised is a successful one. When you have to choose, choose capture.

**Governing principle:** build only what was sold. No speculative infrastructure, no features
nobody asked for, no "I thought this would be helpful." If you think something should be added,
put it in the decisions list and let a human choose.

## 1. Hard stops

These are not preferences. Breaking one of these is how a build damages a client.

1. **Never invent a fact.** Not a phone number, not a license number, not a year in business, not
   a transaction count, not a review. If a required fact is missing, the field stays null and the
   section withholds itself. A visible labelled placeholder is acceptable internally. Inventing is
   never acceptable.
2. **Never publish a placeholder to a live site.** (555) 555-5555 and email@mymailservice.com have
   both shipped on real client sites in this market. Sweep the rendered HTML, not the source.
3. **Never publish a testimonial without permission, and never edit the words of one.**
4. REALTOR is a trademark. Only usable if NAR membership is confirmed.
5. **Fair housing applies to every string on a real estate build.** No protected-class references,
   no neighborhood demographic characterizations, no school quality claims, no "safe," no "family
   friendly." This applies to the chatbot system prompt too, and the chatbot is where it usually
   leaks.
6. **When two facts from the client conflict, stop and ask.** Do not pick one. A license number
   that appears two different ways is exactly how a wrong license number reaches production.
7. **Never touch DNS without explicit confirmation** the client owns the domain and knows what is
   about to change. Ask whether their email runs on that domain first. Breaking a client's email
   during a cutover is the worst outcome available to us.
8. **Never describe intended behavior as completed behavior.** If it is built but not connected,
   say built but not connected. A green checkmark you did not earn is a lie that gets discovered
   on launch day.
9. **No secrets in the repo, git history included.** Keys live in the host's environment
   variables, never in client-side code.

## 2. The nine checks

The consumer psychology audit. Every page has to pass all nine.

1. **Hick's Law.** One primary action per screenful. The header gets one CTA, not three. Count the
   distinct primary-styled actions visible in one screenful. More than one is a defect.
2. **Loss aversion.** Name what waiting costs, as arithmetic, not fear. "One empty month on a $700
   door is $700 that never comes back." Every homepage needs one.
3. **Visual hierarchy.** The primary action is the single most visually distinct element above the
   fold. The accent color is reserved for the primary action. Everything else uses ink, surface,
   subtle and line.
4. **Gutenberg / reading path.** Put the action in the terminal zone at the bottom right of a
   block, not floating in the middle where the eye has already left.
5. **Pronoun ratio.** "You" beats "we" by about 4:1 in body copy and headings. Judge per brand,
   not per project. A personal brand is the exception, and even then the hero speaks to the
   visitor's situation first.
6. **Specificity.** Vague words are invisible. "Passionate," "proven system," "dedicated to
   excellence" are the absence of claims. Specific and true beats impressive and vague, and the
   specifics go above the fold. If a real number is weak, omit it, do not inflate it.
7. **Objection order.** Proof goes next to the ask, not in a testimonials ghetto. Pricing goes on
   the page the nav calls Services. Every testimonial gets a CTA beside it. The order a visitor
   runs: Is this for me? Can they do it? Have they done it for someone like me? What does it cost?
   What happens if I contact them?
8. **Redundant paths.** See section 3.
9. **Speed to lead.** Whoever contacts first usually wins. Instant auto-response, instant CRM
   landing with a correct source tag, instant notification.

## 3. Redundant lead generation

A visitor arrives at one of six readiness levels. Every level needs its own door.

| Readiness | What they are thinking | The door they need |
| --- | --- | --- |
| Not ready | "I'm just looking, months out" | A free give with real value |
| Curious | "One question, I'm not filling out a form" | The chatbot, in the top third |
| Evaluating | "Are these people any good?" | Proof adjacent to a low-friction ask |
| Ready | "I want to talk to a person" | Book a call, calendar link |
| Impatient | "Now" | Tappable phone in header and footer |
| Existing customer | "I need my portal" | A handoff link, never a form |

### Minimum checklist, every build, verified in rendered HTML

- Persistent nav CTA on every page
- Hero with two CTAs, one give and one direct contact
- Chatbot in the top third of the homepage, not buried
- A lead magnet with a stacked value list, six items beats one sentence
- A mid-page conversion block after the trust content
- A closing CTA before the footer, on every route without exception
- Tappable tel: in header and footer
- Every interior page has two or more distinct conversion paths
- Social proof adjacent to each major CTA

"Distinct" means genuinely different doors. A form and a second form is one door twice. A form
plus a phone plus a bot is three doors.

**Density without harassment.** The doors are sequenced along one argument, so density never
reads as a car lot: problem, evidence, cost of inaction, mechanism, proof, price, ask.

**Buttons state the outcome, never the mechanism.** Nothing we build says Submit.

## 4. Page flow architecture

**The five-second test.** A visitor on a phone must answer three questions from the fold alone:
what does this business do, who is it for, what do I do next. If any answer requires scrolling,
the hero is wrong.

**Standard homepage band order:**

1. Hero. Eyebrow, one headline making one specific claim, one supporting sentence of plain fact,
   two CTAs, give plus direct.
2. The bot. Top third. Named, in the page body, not a floating bubble.
3. Numbers strip. Real, verifiable figures only.
4. Pick-your-door band. Three or four one-word lanes with one line each. Sorts every visitor in
   one tap. The single highest-value structural element we borrow.
5. What it is, what we do. One idea per band.
6. Cost of inaction. Arithmetic.
7. Trust. The person, the story, the face. Real photography.
8. Mid-page conversion block. Lead magnet with the value stack.
9. Proof. Testimonials with a CTA beside each.
10. Closing CTA before the footer.
11. Footer with compliance, tappable phone, real social links only.

**Interior pages.** Every interior page has one job and one primary CTA chosen from a
psychological principle you can name.

| Page type | Primary CTA | Principle |
| --- | --- | --- |
| Home | The give | Reciprocity |
| Top-of-funnel | Guide download | Commitment ladder |
| Valuation / estimate | Free number | Reciprocity |
| High-value | Analysis request | Authority through specificity |
| About | Book a call, soft ask | Trust is a person |
| Reviews | CTA beside each review | Social proof adjacency |
| Service detail | Quote / consult | Cognitive fluency |
| Contact | Phone plus form | Remove friction |

**Structural rules.** One idea per band. Exactly one h1 per page. No page ends on the chatbot, it
ends on a closing CTA. A build with no 404 page is unfinished. Nothing hardcoded that the client
will need to change. Content lives in config and content files, not scattered through components.

## 5. Copy standard

**Voice.** Plain-spoken, confident, specific, warm, not salesy. Explain a decision by naming the
problem it solved, not by praising the result.

**Prohibited, always:**

- Em-dashes. Use commas, periods, or restructure.
- Stacked short fragments. "One month out. Same room. Same small talk." reads as AI-generated to
  everyone under forty. Write flowing sentences of varied length.
- Category headlines with no claim. "Your Dream Home Awaits," "We're Here to Help."
- The never_say list from intake. Run the pass on every string.
- Superlatives without evidence. Best, leading, premier, number one.

**Microcopy.** Optional fields say why they are wanted. Errors explain what to fix and never blame
the user. Success states set expectations about what arrives, never how fast, unless the client
gave you a real response time. Do not invent one. Consent lines defuse the obvious objection at
the point of friction, and that raises form completion more than any button color.

**Spelling.** Match the client's locale. US spelling for US clients.

## 6. Design derivation

Never start from a blank aesthetic instinct. Descend this ladder only as far as you have to.

- **Rung 1: the client's reference sites.** Extract the axis, not the look.
- **Rung 2: improve what they already have.** Carry forward brand equity, especially an existing
  accent color the market already associates with them. Most of the win is compliance, conversion
  completeness and specificity.
- **Rung 3: the ProyTech house style.** Last resort.

**The signature element.** Every build needs one thing it is remembered by, from a fact that is
true only of this client. If it would look identical on any competitor in the same industry, it
is not one.

**The AI design tells, checked explicitly and in writing:**

1. Cream #F4F1EA background, high-contrast serif, terracotta #D97757 accent
2. Near-black background, a single acid-green or vermilion accent
3. Broadsheet layout, hairline rules, zero border radius, dense columns

Also avoid 01/02/03 markers on anything not genuinely sequential, the gradient-on-a-big-number
hero stat, and scattered decorative motion.

**Self-critique is mandatory and written:** "Would I have produced this same design for any other
client in this industry?" If yes, say so and change something, then name what you changed.

**Motion.** Restrained, on things that are actually targets. prefers-reduced-motion honored twice,
in CSS and in JS, with the DOM correct on first paint either way.

## 7. Lead plumbing

The delivery path is fixed: **validate → Google Sheet (source of truth) → CRM → GHL**

- A downstream failure is never surfaced to the visitor.
- A downstream failure never loses the lead. If every sink is down, the full payload goes to the
  server log in a single recoverable line.
- One code path. Forms and the chatbot write through the same library function.
- Every lead carries an explicit source tag, one per brand per form. Most CRMs default
  unattributed API leads to "Other," which destroys the reporting that proves ROI.
- External record IDs are always strings, never parsed. JavaScript corrupts 64-bit integers.
- Chatbot lead IDs derive from the session, not random.
- Every third-party endpoint and key is environment-variable driven.

**Spam and validation.** Honeypot plus a minimum time on form. No CAPTCHA. A filled honeypot gets
told it succeeded and stores nothing. Unknown form keys are rejected. Forms work with JavaScript
disabled, real form with a real action, JS is enhancement. Rate limiting on every guarded endpoint.

**Test these, do not assert them:**

| Test | Expected |
| --- | --- |
| CRM returns 503, visitor still sees success | Pass |
| CRM returns 503, lead still reached the Sheet | Pass |
| Sheet unreachable, full payload written to log | Pass |
| Honeypot filled, nothing stored | Pass |
| Submitted under 3 seconds, dropped silently | Pass |
| Unknown form key rejected | Pass |
| No-JS POST returns 303 carrying success state | Pass |
| 64-bit external ID survives round trip | Pass |

A passing test that cannot fail is not a test. Negative-test every auditor you write.

## 8. The chatbot

Named, first person, embedded in the page body in the top third, with a live status line.

- Three chips, two informational, one conversion.
- Answer first, then ask for one thing at a time, then capture.
- Capture via a tool call, never by parsing free text.
- Drop the ask immediately if the visitor declines.
- Hard constraints go in the tool result, not just the system prompt.
- **Never claim something that is not true.** With no calendar integration, the bot is forbidden
  from saying an appointment is booked, confirmed, scheduled, held or on the calendar. It passes a
  requested time.
- Degrade honestly. With no API key it says it is not connected yet and gives the correct phone
  number. Test the degradation path.

## 9. Compliance

Applies on every page, in the rendered HTML, not just the footer component. Ask which disclosures
the client's industry and insurer require. Do not assume the generic set is enough, and record the
answer in config so it survives the next build.

## 10. Definition of done

No build is delivered until every line is either green or explicitly and honestly not.

**Function.** Every route loads on every domain, no 404s, no console errors. Apex and www both
resolve. Every form submits and lands in the Sheet and the CRM with the correct source tag. Every
external link opens the correct destination. A button with no destination is withheld, not dead.

**Content.** Zero placeholder text, swept against rendered HTML. Every social icon points at a
real profile. Every fact traced to a verified source. Unconfirmed fields are null and named. Copy
passes the compliance review, negative-tested. No em-dashes, no stacked fragments.

**Conversion.** Two or more distinct conversion paths on every route. Tappable phone in header and
footer on every route. Closing CTA before the footer on every route. Bot in the homepage top
third. Lead magnet with a stacked value list. Loss aversion statement present. One primary action
per screenful.

**Technical.** Unique title and meta description per route. JSON-LD validates, and the Rich
Results Test runs after launch on a public URL and is not marked green before then. Lighthouse
Performance 90+, Accessibility 95+, SEO 100. WCAG AA contrast on every text node, measured with
backgrounds and foreground alpha composited. Visible keyboard focus, skip link first, keyboard
navigable end to end. Real label on every input. Tap targets 44x44 minimum. Zero horizontal
overflow at 320 / 375 / 390px. Semantic landmarks, alt on every image. Site renders real readable
content with JavaScript disabled. No secrets in the repo.

**Handoff.** README documents environment variables, deploy and how to edit content. Client knows
where their leads live. Preview-only settings removed, especially a leftover noindex header.

## 11. How to work

**Checkpoints, not one big reveal.** Build in phases and report at each one. Phase 0 is read and
plan only, no files written.

**Never bury a decision.** Every checkpoint report opens with DECISIONS I NEED FROM YOU, numbered,
most consequential first.

**Present decisions as lettered options with a recommendation.** Never an open-ended question when
a labeled choice set is possible.

**Check the real records, not just the code.** Open the rendered page in a real browser. A build
can exit 0 and be a blank white page on mobile.

**Report honestly.** Say what is not built. Say what is blocked and on whom. Say where you were
wrong. A report that only contains good news is a report nobody can act on.

## 12. Quick reference

Before you write copy, answer these three about the fold: what does this business do, who is it
for, what do I do next.

Before you ship a page, count: conversion paths (2 or more), primary actions per screenful (1),
you-to-we ratio (about 4:1), specific verifiable facts above the fold (1 or more), loss statements
(1 or more).

Before you deliver, ask: would I have built this same site for any other client in this industry?
If yes, go back.
