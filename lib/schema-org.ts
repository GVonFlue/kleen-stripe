import { content } from "@/lib/content";
import { answeredFaqs, type Content } from "@/content/schema";
import { absoluteUrl } from "@/lib/site";

/**
 * JSON-LD, built from the content layer and from nothing else.
 *
 * The same rule that governs the visible page governs this: a null is a fact we
 * do not have, and it is omitted rather than filled. Doctrine hard stop 1 does not
 * stop applying because the output is machine readable. So there is no
 * `address` block while business.street_address is null, no `openingHours` while
 * hours is null, no `aggregateRating` while zero reviews have consent, and no
 * `sameAs` while both social profiles are null. Structured data that claims a
 * fact the page does not is exactly the kind of mismatch that gets a local
 * listing discounted, and inventing one here would be worse than omitting it
 * because nobody would ever see it to catch it.
 *
 * `areaServed` is the one place the geography goes, since address_display is
 * service_area_only. That is the honest shape for a business that works out of a
 * truck across a state.
 */

type Service = Content["services"][number];

const { business } = content;

function localBusiness() {
  const node: Record<string, unknown> = {
    "@type": "ProfessionalService",
    "@id": absoluteUrl("/#business"),
    name: business.name,
    url: absoluteUrl("/"),
    telephone: `+1${business.phone_primary}`,
    email: business.email,
    description: content.pages["/"].meta_description ?? undefined,
    areaServed: content.areas.map((a) => ({
      "@type": "City",
      name: a.city,
      addressRegion: a.state,
    })),
    address: {
      // No streetAddress: business.street_address is null and the two public
      // listings disagree on the city. That conflict is tracked as a launch
      // blocker; it does not get papered over here.
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.state,
      addressCountry: "US",
    },
  };

  if (business.founded_year) node.foundingDate = String(business.founded_year);
  if (business.hours) node.openingHours = Object.values(business.hours);

  const sameAs = [business.social.facebook, business.social.google_business_profile].filter(
    (u): u is string => typeof u === "string",
  );
  if (sameAs.length > 0) node.sameAs = sameAs;

  return node;
}

/** Sitewide graph. One node for the business, one for the site. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      localBusiness(),
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: business.name,
        publisher: { "@id": absoluteUrl("/#business") },
      },
    ],
  };
}

export function breadcrumbs(trail: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      ...(step.path ? { item: absoluteUrl(step.path) } : {}),
    })),
  };
}

/**
 * Service plus, where the page actually carries answered questions, FAQPage.
 * Withheld answers are excluded the same way they are excluded from the page:
 * answeredFaqs is the single filter both go through, so the markup can never
 * describe a question the visitor cannot see answered.
 */
export function servicePageGraph(service: Service) {
  const faqs = answeredFaqs(service.faqs);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Service",
      "@id": absoluteUrl(`/${service.slug}/#service`),
      name: service.name,
      description: service.lede,
      serviceType: service.name,
      provider: { "@id": absoluteUrl("/#business") },
      areaServed: content.areas.map((a) => ({
        "@type": "City",
        name: a.city,
        addressRegion: a.state,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: content.ui.service_scope_heading,
        itemListElement: service.scope.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item },
        })),
      },
    },
  ];

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": absoluteUrl(`/${service.slug}/#faq`),
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
