import { content } from "@/lib/content";
import Hero from "@/components/blocks/Hero";
import PickYourDoor from "@/components/blocks/PickYourDoor";
import JourneyBand from "@/components/blocks/JourneyBand";
import NumbersStrip from "@/components/blocks/NumbersStrip";
import BeforeAfterFeature from "@/components/blocks/BeforeAfterFeature";
import ServiceGrid from "@/components/blocks/ServiceGrid";
import CostOfInaction from "@/components/blocks/CostOfInaction";
import ThreeColumn from "@/components/blocks/ThreeColumn";
import Trust from "@/components/blocks/Trust";
import LeadMagnetBlock from "@/components/blocks/LeadMagnetBlock";
import ReviewsBlock from "@/components/blocks/ReviewsBlock";
import ClosingCta from "@/components/blocks/ClosingCta";
import SignatureVisual from "@/components/blocks/SignatureVisual";
import PaintedLine from "@/components/PaintedLine";

const page = content.pages["/"];

// Called as plain functions, not JSX, on purpose: these are stateless server
// components, and calling them directly lets us see whether one withheld
// itself (numbers strip and before/after both currently return null) before
// deciding to place a divider after it. A divider between two blocks that
// withheld themselves would be two painted lines stacked on empty space.
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

export default function HomePage() {
  const blocks = page.blocks ?? [];
  const rendered = blocks.map((block) => ({ id: block.id, node: renderBlock(block) })).filter((b) => b.node !== null);

  return (
    <>
      {rendered.map((b, i) => {
        const isLast = i === rendered.length - 1;
        return (
          <div key={b.id}>
            {b.node}
            {/* The backbone: a painted divider between every homepage band that
                actually rendered, in the same accent yellow as the paint in the
                photographs beside it. */}
            {!isLast && (
              <div className="mx-auto max-w-6xl px-4">
                <PaintedLine />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
