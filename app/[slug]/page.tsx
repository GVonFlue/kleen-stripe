import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { getAllRoutes } from "@/lib/routes";
import { interpolate } from "@/lib/render";
import ServicePage from "@/components/pages/ServicePage";
import BuyerPage from "@/components/pages/BuyerPage";
import AreaPage from "@/components/pages/AreaPage";

export function generateStaticParams() {
  return getAllRoutes()
    .filter((r) => r.kind === "service" || r.kind === "buyer" || r.kind === "area")
    .map((r) => ({ slug: (r as { slug: string }).slug }));
}

function findEntry(slug: string) {
  const service = content.services.find((s) => s.slug === slug);
  if (service) return { kind: "service" as const, service };
  const buyer = content.buyers.find((b) => b.slug === slug);
  if (buyer) return { kind: "buyer" as const, buyer };
  const area = content.areas.find((a) => a.slug === slug);
  if (area) return { kind: "area" as const, area };
  return null;
}

// Next 16: params is a Promise, not a plain object. This build's own auto-generated
// agent notes flagged this explicitly, so it is called out here rather than left as
// a silent gotcha for the next person to hit.
type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) return {};
  if (entry.kind === "service") return { title: entry.service.title, description: entry.service.meta_description };
  if (entry.kind === "buyer") return { title: entry.buyer.title, description: entry.buyer.meta_description };
  const t = content.area_page_template;
  const vars = { city: entry.area.city, state: entry.area.state };
  return { title: interpolate(t.title_template, vars), description: interpolate(t.meta_description_template, vars) };
}

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) return notFound();

  if (entry.kind === "service") return <ServicePage service={entry.service} content={content} />;
  if (entry.kind === "buyer") return <BuyerPage buyer={entry.buyer} />;
  return <AreaPage area={entry.area} content={content} />;
}
