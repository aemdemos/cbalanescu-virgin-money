/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards6)'];
  const cells = [headerRow];

  // Find all cards
  // Each .sl-item contains 2 section.cm-content-tile, total 6 cards
  const cardSections = element.querySelectorAll('section.cm-content-tile');
  cardSections.forEach((section) => {
    // First cell: image
    let imageCell = null;
    const imgEl = section.querySelector('.image img');
    if (imgEl) imageCell = imgEl;

    // Second cell: text content
    const contentDiv = section.querySelector('.content');
    const cellItems = [];

    // Title: <h3 class="header"><b>Title</b></h3>
    const titleEl = contentDiv.querySelector('.header');
    if (titleEl) cellItems.push(titleEl);
    // Description: first <p> with non-empty text, excluding subheading and CTA
    // Subheading p is always empty here, so skip it
    let descEl = null;
    const ps = contentDiv.querySelectorAll('p');
    for (let p of ps) {
      // If p contains a link, it's probably CTA, skip for desc
      if (p.querySelector('a')) continue;
      if (p.textContent.trim().length > 0) {
        descEl = p;
        break;
      }
    }
    if (descEl) cellItems.push(descEl);
    // CTA: first <p> that contains an <a>
    let ctaEl = null;
    for (let p of ps) {
      if (p.querySelector('a')) {
        ctaEl = p;
        break;
      }
    }
    if (ctaEl) cellItems.push(ctaEl);

    cells.push([
      imageCell,
      cellItems
    ]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
