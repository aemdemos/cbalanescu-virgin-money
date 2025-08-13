/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card sections (cards inside tiles)
  function getCardSections(el) {
    // Only select direct descendants of .cm-content-tile
    return Array.from(el.querySelectorAll('.cm-content-tile'));
  }

  // Build header row
  const rows = [['Cards (cards5)']];

  // Find all card sections
  const cardSections = getCardSections(element);

  cardSections.forEach((section) => {
    // Get image element (keep reference)
    const img = section.querySelector('img');

    // Find content div
    const content = section.querySelector('.content');
    let textContent = [];
    if (content) {
      // Title: h3.header or .header or b
      const cardHeading = content.querySelector('.header, h3, b');
      if (cardHeading) textContent.push(cardHeading);

      // Subheading, if present and not empty
      const subHeading = content.querySelector('.subheading');
      if (subHeading && subHeading.textContent.trim()) textContent.push(subHeading);

      // Description: the first p that does NOT contain a link
      const descP = Array.from(content.querySelectorAll('p')).find(p => !p.querySelector('a') && p.textContent.trim());
      if (descP) textContent.push(descP);

      // CTA: first <a>
      const ctaLink = content.querySelector('a');
      if (ctaLink) textContent.push(ctaLink);
    }
    rows.push([
      img,
      textContent
    ]);
  });

  // Replace element with created table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
