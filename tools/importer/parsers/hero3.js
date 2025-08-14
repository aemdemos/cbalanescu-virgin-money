/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero3)'];

  // 2. Image row: no background image in the supplied HTML, so cell is blank
  const imageRow = [''];

  // 3. Content row: Combine all content, referencing existing elements
  // Get headline (h1), subtitle, main descriptive paragraph, and CTA (button-like span)
  const content = [];

  // Headline: find first h1, reference its existing child (for any inline formatting)
  const h1 = element.querySelector('h1');
  if (h1 && h1.textContent.trim()) {
    content.push(h1);
  }

  // Subtitle: find span.subtitle
  const subtitle = element.querySelector('span.subtitle');
  if (subtitle && subtitle.textContent.trim()) {
    content.push(subtitle);
  }

  // Description: find the main paragraph (non-empty, not just whitespace)
  // There may be empty paragraphs, so filter accordingly
  const paragraphs = Array.from(element.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0);
  // Exclude paragraphs fully inside h1/header or containing only the CTA
  paragraphs.forEach((p) => {
    // Exclude paragraphs that are children of h1 or that duplicate the CTA
    if (!h1 || !h1.contains(p)) {
      // Avoid paragraphs containing only the cta span
      if (!p.querySelector('span.cta')) {
        content.push(p);
      }
    }
  });

  // CTA: find span.cta (reference as inline element)
  const cta = element.querySelector('span.cta');
  if (cta && cta.textContent.trim()) {
    content.push(cta);
  }

  // Compose the row: combine all content into a single cell (as required)
  const contentRow = [content];

  // Compose the full table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
