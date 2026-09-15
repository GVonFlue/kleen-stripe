import { content } from "@/lib/content";
import LeadForm from "@/components/LeadForm";

/**
 * The second conversion path on every interior detail page.
 *
 * Before the audit pass, a service, buyer or area page offered exactly one thing:
 * links out to /contact/, plus tel: and sms:. That is fine for the visitor
 * standing in a lot with a phone in their hand, and it is the wrong and only
 * option for the property manager reading at a desk at 4pm who wants to send a
 * scope and get a paper trail. Doctrine's redundant-path rule says no page ships
 * with one door; three buttons pointing at the same door is still one door.
 *
 * So the form comes to the page rather than the page sending the visitor to find
 * it. Source tag is the page's own, so a lead arrives knowing which service,
 * which segment or which city it came off, instead of every interior route
 * collapsing into one contact-page tag.
 *
 * It sits inside the article column at the foot of the content, still inside the
 * page's asphalt Band. Nothing is restyled: .on-asphalt already repoints
 * --surface, --ink and --line, so LeadForm's own field styles render correctly on
 * the dark tone without a dark variant of their own.
 */
export default function InlineQuote({
  sourceTag,
  consentLine,
}: {
  sourceTag: string;
  consentLine?: string | null;
}) {
  const ui = content.ui;

  return (
    <section className="mt-14 border-t border-[var(--line)] pt-10">
      <h2 className="text-[length:var(--text-h2)] font-black text-[var(--ink)]">{ui.inline_form_heading}</h2>
      <p className="mt-3 max-w-[60ch] text-[var(--ink)]/70">{ui.inline_form_note}</p>
      <LeadForm className="mt-7" sourceTag={sourceTag} consentLine={consentLine ?? null} />
    </section>
  );
}
