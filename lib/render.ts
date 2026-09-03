import { isPending, type Content } from "@/content/schema";
import { buildMode } from "@/lib/content";

/**
 * Resolves a dot path against the content object, the same shape schema.ts uses
 * for provenance paths. `content.pricing.sealcoat_per_sqft` on a content object
 * with no `pricing` key resolves to undefined rather than throwing, which is what
 * lets a block quietly withhold instead of crashing the page.
 */
export function resolvePath(obj: unknown, path: string): unknown {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce((acc: any, key) => (acc == null ? acc : acc[key]), obj);
}

/** True only when every path resolves to something other than null, undefined or "". */
export function hasAll(content: unknown, paths?: string[]): boolean {
  if (!paths || paths.length === 0) return true;
  return paths.every((p) => {
    const v = resolvePath(content, p);
    return v !== null && v !== undefined && v !== "";
  });
}

/**
 * Resolves a `{{dot.path}}` template string against content, with `{{h1}}` resolving
 * against the current page's own h1 rather than the content root. Returns null if the
 * token cannot be resolved, so the caller can fall back to a fallback_* field instead
 * of printing "undefined" on the page.
 */
export function resolveTemplate(template: string, content: Content, pageH1?: string): string | null {
  const tokens = template.match(/\{\{([^}]+)\}\}/g);
  if (!tokens) return template;
  let out = template;
  for (const t of tokens) {
    const path = t.slice(2, -2).trim();
    const value = path === "h1" ? pageH1 : resolvePath(content, path);
    if (value === null || value === undefined || value === "") return null;
    out = out.replace(t, String(value));
  }
  return out;
}

/** Turns a content-authored slot key like "hero_before_after" into "Hero before after". */
export function slotLabel(slot: string): string {
  const words = slot.replace(/[_-]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Simple `{{var}}` substitution against a flat local object, for templates whose
 *  tokens are not paths into content (e.g. the area page template's {{city}}). */
export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

/** business.phone_primary is stored as raw 10 digits. Formatting is a render concern. */
export function telHref(phone: string): string {
  return `tel:+1${phone}`;
}
export function smsHref(phone: string): string {
  return `sms:+1${phone}`;
}

/**
 * Separate from LAUNCH on purpose. LAUNCH governs whether the build refuses to
 * compile while facts are unconfirmed; it says nothing about whether the visible
 * "pending Devin's confirmation" badges should show on a build someone is actually
 * looking at. Devin reviewing the site should see a clean page, not QA annotations,
 * so those badges are opt-in via DRAFT_BADGES=1 rather than on by default whenever
 * the build merely isn't LAUNCH.
 */
export const showDraftBadges = process.env.DRAFT_BADGES === "1";

export { isPending, buildMode };
