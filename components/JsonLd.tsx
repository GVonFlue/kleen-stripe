/**
 * One place that writes a JSON-LD script tag, so no component builds the
 * <script> by hand and no payload reaches the page without going through the
 * same escaping. `<` is escaped because a stray one inside a string would
 * otherwise let the JSON close the script element early.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
