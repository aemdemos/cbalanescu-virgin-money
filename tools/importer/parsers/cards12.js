/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get header row for block
  const headerRow = ['Cards (cards12)'];

  // 2. Find all cards
  // The cards are inside a nested structure:
  // .sl-list.has-2-items (the innermost), under .column-container > .sl > .sl-list.has-feature-right > .sl-item
  // So, find all .cm-content-tile (each card) regardless of depth
  const cardSections = element.querySelectorAll('section.cm-content-tile');

  // 3. Build rows for each card
  const rows = Array.from(cardSections).map(card => {
    // Image: find first image inside card
    const img = card.querySelector('img');
    // For the text cell, we want:
    // - Heading (h3.header)
    // - Description (first non-empty <p>)
    // - CTA (a with text)
    const content = card.querySelector('.content');
    const textCell = [];
    if (content) {
      // Heading
      const heading = content.querySelector('h3.header');
      if (heading) textCell.push(heading);
      // Subheading: (optional, usually empty, skip if blank)
      const subheading = content.querySelector('p.subheading');
      if (subheading && subheading.textContent.trim()) {
        textCell.push(subheading);
      }
      // Description: pick all paragraphs that are not subheading, and not containing CTA
      const paragraphs = Array.from(content.querySelectorAll('p')).filter(p => {
        return !p.classList.contains('subheading') && !p.querySelector('.cta');
      });
      paragraphs.forEach(p => {
        if (p.textContent.trim()) textCell.push(p);
      });
      // CTA (a with .cta inside)
      const ctaLink = content.querySelector('a');
      if (ctaLink) textCell.push(ctaLink);
    }
    return [img, textCell];
  });

  // 4. Compose table data
  const cells = [headerRow, ...rows];

  // 5. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
