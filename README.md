# Kleen Stripe

Content-driven marketing site for Kleen Stripe, Wichita KS. Next.js on Vercel, Tailwind, with the
entire site rendered from a schema-validated content layer.

## Status

**Phase 0 complete. The application is not built yet.** What exists is the content layer, the
schema that guards it, and the doctrine. `app/`, `components/`, `lib/` and `scripts/` are the
build.

## Quick start

```bash
cd ~/Documents/kleen-stripe
claude
```

Then tell Claude Code to read `CLAUDE.md` and start at checkpoint 1. The full brief is in
`docs/CLAUDE_CODE_PROMPT.md`.

## Content

Everything a client would ever want to change lives in `content/kleen-stripe.json`. Nothing is
hardcoded in a component. Phone, email, hours, services, scope lists, service areas, titles, meta
descriptions, the lead magnet value stack, all of it. Change the JSON, rebuild, redeploy.

A field set to `null` means unverified. The site withholds that section rather than inventing it.
That is deliberate. Do not fill a `null` with a plausible guess.

`provenance.pending_confirmation` lists every value that came from a third party or from the
client's old site rather than from Devin directly. Those render in draft with a badge and block a
launch build until he confirms them.

This is the same shape as the ProyTech self-edit portal architecture: schema-validated content,
code that only renders it.

## Environment variables

| Variable | Default | What it does |
| --- | --- | --- |
| `FORM_ENDPOINT` | `/api/lead` | The `action` on every form. Point it at the real endpoint or a Formspree URL. |
| `LAUNCH` | unset | `1` runs the strict content audit. Launch builds must use it. |

No secrets in this repo and none belong here. Keys live in the host's environment.

## Lead plumbing

The doctrine path is validate, Google Sheet as source of truth, CRM, GHL. **None of it is built.**
When the client side exists it will post to `/api/lead`, and that endpoint still has to do the
whole path. Nothing in this repo should describe that as done.

## What is not done

- The application itself. No routes, no components.
- Lead endpoint, Sheet, CRM, GHL.
- Real photography. `work` is an empty array and `/work/` stays noindex until it is not.
- The ADA checklist PDF. Every figure in it must be checked against the 2010 ADA Standards for
  Accessible Design before it is written.
- Published reviews. One review exists on file and its consent flag is false.
- DNS, and the 301 from the second domain.
- Lighthouse and the Rich Results Test. Both need a public URL, so they run after deploy.
