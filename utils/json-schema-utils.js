/**
 * Adds a linked data schema script to the document head.
 * @param {object} schema - A valid Schema.org JSON-LD object.
 */
export default function addLinkedDataSchema(schema = {}) {
  const jsonSchema = JSON.stringify({
    '@context': 'https://schema.org',
    ...schema,
  });

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = jsonSchema; // safer than innerHTML
  if (schema?.['@type']) {
    script.dataset.type = schema['@type'];
  }

  document.head.appendChild(script);
}
