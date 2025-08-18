/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the requirements
  const headerRow = ['Accordion (accordion13)'];
  const cells = [headerRow];

  // Select all accordion items
  const items = element.querySelectorAll('ul.accordion-list > li');

  items.forEach((item) => {
    // Title cell extraction: reference the clickable title/link
    const link = item.querySelector('a.accordion-item');
    if (!link) return; // Edge case: skip if no link found
    // Remove any nested icon or arrow from the link
    const arrow = link.querySelector('div.ec');
    if (arrow) arrow.remove();

    // Content cell extraction: reference the content panel div
    const contentPanel = item.querySelector('div.expandcollapse-content');
    let contentCell;
    if (contentPanel) {
      contentCell = contentPanel;
    } else {
      contentCell = document.createElement('div'); // Fallback: empty div preserves cell structure
    }

    cells.push([link, contentCell]);
  });

  // Create the block table using WebImporter DOM helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element in the document with the new block table
  element.replaceWith(block);
}
