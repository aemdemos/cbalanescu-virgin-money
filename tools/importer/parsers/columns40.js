/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns: the .sl-list > .sl-item elements are the columns
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (items.length < 2) return;

  // Prepare the header
  const headerRow = ['Columns (columns40)'];

  // Each sl-item contains all relevant content for a column
  // Reference the full element for each column cell
  const row = items.map(item => item);

  // Ensure both columns exist, and gracefully handle missing ones
  while (row.length < 2) {
    row.push(document.createElement('div'));
  }

  // Compose table
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
