import raw from "@/content/kleen-stripe.json";
import { parseContent, type BuildMode, type Content } from "@/content/schema";

/**
 * Parses once at module load. LAUNCH=1 runs the strict audit: it throws while any
 * fact in provenance.pending_confirmation is still outstanding. That is deliberate.
 * See CLAUDE.md, "the launch build is supposed to fail."
 */
export const buildMode: BuildMode = process.env.LAUNCH === "1" ? "launch" : "draft";

export const content: Content = parseContent(raw, buildMode);
