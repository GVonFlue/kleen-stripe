import raw from "@/content/kleen-stripe.json";
import { parseContent, type BuildMode, type Content } from "@/content/schema";

/**
 * Parses once at module load. LAUNCH=1 runs the strict audit: it throws while any
 * fact in provenance.pending_confirmation is still outstanding. That is deliberate.
 * See CLAUDE.md, "the launch build is supposed to fail."
 */
export const buildMode: BuildMode = process.env.LAUNCH === "1" ? "launch" : "draft";

export const content: Content = parseContent(raw, buildMode);

/**
 * The homepage's own closing block (heading, body, both CTAs), read once here
 * rather than re-finding it in every component that reuses it. Blocks are
 * z.any() at the schema level (see content/schema.ts), so this is `any`, same
 * as every block component's own `block` prop. Used by ClosingBar (every
 * interior route's closing band, which had no copy of its own) and QuoteAside
 * (the sticky quote panel), so the one "send a photo, get a number back" ask
 * reads the same wherever it appears instead of drifting into new copy.
 */
export const closingCopy = (content.pages["/"]?.blocks ?? []).find((b: any) => b.id === "closing") as any;
