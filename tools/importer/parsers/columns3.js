/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name from the instructions and example
  const headerRow = ['Columns (columns3)'];

  // Find the columns (sl-item direct children of .sl-list)
  const slList = element.querySelector('.sl-list');
  const slItems = slList ? slList.querySelectorAll(':scope > .sl-item') : [];

  // Defensive: Always create two columns, but allow fallback if missing
  let col1 = null;
  let col2 = null;

  // Column 1: the image block
  if (slItems.length > 0) {
    // Use the entire sl-item so all markup is retained
    col1 = slItems[0];
  } else {
    col1 = document.createElement('div');
  }

  // Column 2: the rich text/call-to-action block
  if (slItems.length > 1) {
    col2 = slItems[1];
  } else {
    col2 = document.createElement('div');
  }

  // Structure matches the markdown example: header row, then one row with 2 columns
  const cells = [
    headerRow,
    [col1, col2]
  ];

  // Build the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
