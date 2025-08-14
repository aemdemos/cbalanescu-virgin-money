/* global WebImporter */
export default function parse(element, { document }) {
  // Define the table header matching the example
  const headerRow = ['Columns (columns5)'];

  // Get the list of columns
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (items.length < 2) return;

  // Column 1: image block (reference the entire .sl-item for resilience)
  const leftCell = items[0];
  // Column 2: rich text and link block (reference the entire .sl-item for resilience)
  const rightCell = items[1];

  // Compose the table rows
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
