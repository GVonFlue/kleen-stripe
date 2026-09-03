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

const page = content.pages["/"];

export default function HomePage() {
  return (
    <>
      {page.blocks?.map((block) => {
        switch (block.id) {
          case "hero":
            return <Hero key={block.id} block={block} />;
          case "doors":
            return <PickYourDoor key={block.id} block={block} />;
          case "journey":
            return <JourneyBand key={block.id} block={block} />;
          case "numbers":
            return <NumbersStrip key={block.id} block={block} />;
          case "before_after":
            return <BeforeAfterFeature key={block.id} block={block} />;
          case "what_he_does":
            return <ServiceGrid key={block.id} block={block} />;
          case "cost_of_inaction":
            return <CostOfInaction key={block.id} block={block} />;
          case "differentiators":
            return <ThreeColumn key={block.id} block={block} />;
          case "trust":
            return <Trust key={block.id} block={block} />;
          case "lead_magnet":
            return <LeadMagnetBlock key={block.id} />;
          case "proof":
            return <ReviewsBlock key={block.id} block={block} />;
          case "closing":
            return <ClosingCta key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
