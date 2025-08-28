/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards13)'];

  // Extract all card <section>'s in order from the element
  const cardSections = element.querySelectorAll('section.cm.cm-icon-title');

  // Build rows for each card
  const rows = Array.from(cardSections).map(section => {
    // Icon: first img in .header
    const headerDiv = section.querySelector('.header');
    const img = headerDiv ? headerDiv.querySelector('img') : null;

    // Text column: Title (h2), Description (first p), CTA (a in second p)
    const textContent = [];
    if (headerDiv) {
      const h2 = headerDiv.querySelector('h2');
      if (h2) textContent.push(h2);
    }
    const contentDiv = section.querySelector('.content');
    if (contentDiv) {
      const ps = contentDiv.querySelectorAll('p');
      if (ps[0]) textContent.push(ps[0]);
      if (ps[1]) {
        const a = ps[1].querySelector('a');
        if (a) textContent.push(a);
      }
    }
    return [img, textContent];
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
