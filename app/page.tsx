import { content } from "@/lib/content";
import Hero from "@/components/blocks/Hero";
import PickYourDoor from "@/components/blocks/PickYourDoor";
import JourneyBand from "@/components/blocks/JourneyBand";
import NumbersStrip from "@/components/blocks/NumbersStrip";
import BeforeAfterFeature from "@/components/blocks/BeforeAfterFeature";
import WorkStrip from "@/components/blocks/WorkStrip";
import ServiceGrid from "@/components/blocks/ServiceGrid";
import CostOfInaction from "@/components/blocks/CostOfInaction";
import ThreeColumn from "@/components/blocks/ThreeColumn";
import Trust from "@/components/blocks/Trust";
import LeadMagnetBlock from "@/components/blocks/LeadMagnetBlock";
import ReviewsBlock from "@/components/blocks/ReviewsBlock";
import ClosingCta from "@/components/blocks/ClosingCta";
import SignatureVisual from "@/components/blocks/SignatureVisual";
import PaintedLine from "@/components/PaintedLine";
import Band from "@/components/Band";
import LotStripe from "@/components/LotStripe";

const page = content.pages["/"];

// Called as plain functions, not JSX, on purpose: these are stateless server
// components, and calling them directly lets us see whether one withheld
// itself (numbers strip and before/after both currently return null) before
// deciding how to seat the ones that did render. A band wrapped around a block
// that withheld itself would be a black rectangle full of nothing.
function renderBlock(block: any) {
  switch (block.id) {
    case "hero":
      return Hero({ block });
    case "doors":
      return PickYourDoor({ block });
    case "journey":
      return JourneyBand({ block });
    case "numbers":
      return NumbersStrip({ block });
    case "before_after":
      return BeforeAfterFeature({ block });
    case "work_strip":
      return WorkStrip({ block });
    case "what_he_does":
      return ServiceGrid({ block });
    case "cost_of_inaction":
      return CostOfInaction({ block });
    case "differentiators":
      return ThreeColumn({ block });
    case "stallgrid":
      return SignatureVisual({ block });
    case "trust":
      return Trust({ block });
    case "lead_magnet":
      return LeadMagnetBlock();
    case "proof":
      return ReviewsBlock({ block });
    case "closing":
      return ClosingCta({ block });
    default:
      return null;
  }
}

/**
 * Which surface each band sits on, and which lot marking closes it.
 *
 * The page alternates asphalt and white rather than running white throughout,
 * because the wordmark this site is built around is yellow on black and a site
 * that never goes black never actually shows its own brand. The rhythm is also
 * doing work: every asphalt band is a claim about the pavement (how the job goes,
 * what neglect costs, the lot drawing itself, the closing ask) and every white
 * band is a claim about the business (who he works for, what he does, why him,
 * what customers said). Surface follows subject.
 *
 * `mark` names the marking that lays down along the bottom edge of that dark band
 * as it scrolls into view. They run in the order a real lot is laid out: stalls
 * first under the hero, then the crosswalk, then the drive-aisle arrows, then the
 * hatched access aisle beside the accessible stall. Hero carries its own, so it is
 * not listed here.
 */
const TONE: Record<string, { tone: "surface" | "subtle" | "asphalt" | "accent"; mark?: "crosswalk" | "arrow" | "hatch" | "stall" }> = {
  hero: { tone: "asphalt" },
  doors: { tone: "surface" },
  journey: { tone: "subtle" },
  numbers: { tone: "subtle" },
  before_after: { tone: "surface" },
  what_he_does: { tone: "surface" },
  cost_of_inaction: { tone: "asphalt", mark: "arrow" },
  differentiators: { tone: "surface" },
  stallgrid: { tone: "asphalt", mark: "hatch" },
  trust: { tone: "surface" },
  // LeadMagnetBlock paints its own ADA-blue field and hatch (direction-v2.html's
  // signature block) rather than the shared dark tone: tone: "surface" here is a
  // transparent seat, not a color choice. See the component for why it cannot
  // sit inside an asphalt Band (--ada gets repointed to ada_on_dark in there).
  lead_magnet: { tone: "surface" },
  work_strip: { tone: "surface" },
  proof: { tone: "subtle" },
  // direction-v2.html: the closing band is the one loud yellow moment on the
  // page, not another black one. See ClosingCta and Band's accent tone.
  closing: { tone: "accent" },
};

export default function HomePage() {
  const blocks = page.blocks ?? [];
  const rendered = blocks
    .map((block) => ({ id: block.id, node: renderBlock(block) }))
    .filter((b) => b.node !== null);

  return (
    <>
      {rendered.map((b, i) => {
        const cfg = TONE[b.id] ?? { tone: "surface" as const };
        const next = rendered[i + 1];
        const nextTone = next ? (TONE[next.id]?.tone ?? "surface") : null;

        // The hero builds its own band, scrim and marking. Everything else gets
        // seated here so the rhythm lives in one readable table above.
        if (b.id === "hero") return <div key={b.id}>{b.node}</div>;

        // A painted divider is only needed where two bands share a surface. Where
        // the surface changes, the change is the divider, and stacking a rule on
        // top of it is the kind of decoration that made the old page feel busy
        // and flat at the same time.
        const needsRule = nextTone !== null && nextTone === cfg.tone;

        return (
          <div key={b.id}>
            <Band tone={cfg.tone} seam={cfg.tone === "asphalt"}>
              {b.node}
              {cfg.mark && (
                <div className="-mb-px">
                  <LotStripe variant={cfg.mark} />
                </div>
              )}
              {needsRule && (
                <div className="mx-auto max-w-6xl px-4">
                  <PaintedLine />
                </div>
              )}
            </Band>
          </div>
        );
      })}
    </>
  );
}
