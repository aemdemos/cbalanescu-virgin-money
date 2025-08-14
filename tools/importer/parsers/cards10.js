/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the block definition
  const cells = [['Cards (cards10)']];

  // Get the card container list
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Get all card groups (skip the first .sl-item, which is the heading)
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  const cardSections = [];
  for (let i = 1; i < slItems.length; i++) {
    // Support both <section> (cards) and fallback divs
    const sections = Array.from(slItems[i].querySelectorAll(':scope > section'));
    cardSections.push(...sections);
  }

  // Build a row for each card
  cardSections.forEach((section) => {
    // Icon (img)
    let img = null;
    const headerDiv = section.querySelector('.header');
    if (headerDiv) {
      img = headerDiv.querySelector('img');
    }
    // Title (h2.header)
    let title = null;
    if (headerDiv) {
      title = headerDiv.querySelector('h2.header');
    }
    // Description (all paragraphs in .content)
    let descs = [];
    const contentDiv = section.querySelector('.content');
    if (contentDiv) {
      descs = Array.from(contentDiv.querySelectorAll('p'));
    }
    // Make the text cell: title (if present), then all descs
    const textCell = [];
    if (title) textCell.push(title);
    if (descs.length > 0) textCell.push(...descs);
    cells.push([
      img || '',
      textCell.length ? textCell : ''
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
