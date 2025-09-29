/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists and has children
  if (!element || !element.children || element.children.length === 0) return;

  // Table header row as per block spec
  const headerRow = ['Cards (cardsNoImages1)'];

  // Each .item is a card
  const items = Array.from(element.querySelectorAll(':scope > .item'));
  const rows = items.map((item) => {
    // Each card's content is in the h5 (may include <span>, <sup>, <small>, <br>, etc.)
    // We want to preserve the structure for resilience
    const h5 = item.querySelector('h5');
    if (h5) {
      return [h5];
    }
    // Fallback: use the entire item if h5 missing
    return [item];
  });

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
