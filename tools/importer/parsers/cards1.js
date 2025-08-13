/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards1)'];

  // The cards are in .sl-list > .sl-item > section.cm.cm-icon-title
  // A .sl-item contains 2 section.cm.cm-icon-title cards
  const cardSections = [];
  const slItems = element.querySelectorAll('.sl-list .sl-item');
  slItems.forEach(item => {
    // Each .sl-item has one or more section.cm.cm-icon-title
    const sections = item.querySelectorAll('section.cm.cm-icon-title');
    sections.forEach(section => {
      cardSections.push(section);
    });
  });

  // Edge case: fallback if selector above finds nothing (for robustness)
  if (cardSections.length === 0) {
    const sections = element.querySelectorAll('section.cm.cm-icon-title, section.cm-icon-title');
    sections.forEach(section => cardSections.push(section));
  }

  const rows = cardSections.map(section => {
    // First cell: the image/icon
    const img = section.querySelector('.header img');
    // Second cell: text content
    // Title (h2)
    const h2 = section.querySelector('.header h2');
    // All content <p>
    const contentPs = Array.from(section.querySelectorAll('.content p'));
    // Split into description and CTA
    let descriptionPs = [];
    let ctaP = null;
    if (contentPs.length > 1 && contentPs[contentPs.length - 1].querySelector('a')) {
      descriptionPs = contentPs.slice(0, contentPs.length - 1);
      ctaP = contentPs[contentPs.length - 1];
    } else {
      descriptionPs = contentPs;
    }
    // Compose text cell elements
    const textCellEls = [];
    if (h2) textCellEls.push(h2);
    descriptionPs.forEach(p => textCellEls.push(p));
    if (ctaP) textCellEls.push(ctaP);
    return [img, textCellEls];
  });

  // Only create rows for valid cards (with at least an image and at least a title or description)
  const filteredRows = rows.filter(row => {
    const [img, textCellEls] = row;
    // Must have an image and at least one text element
    return img && textCellEls && textCellEls.length > 0;
  });

  const cells = [headerRow, ...filteredRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
