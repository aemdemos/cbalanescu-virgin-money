/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container (sl-list)
  const columnsList = element.querySelector('.sl-list');
  if (!columnsList) return;

  // Each direct child .sl-item is a column
  const columnItems = Array.from(columnsList.querySelectorAll(':scope > .sl-item'));

  // For each .sl-item, get its <section> block (or item itself if missing)
  const cellsRow = columnItems.map(item => {
    const section = item.querySelector('section');
    return section || item;
  });

  // Build the table: header is a single cell, next row is all columns
  const cells = [
    ['Columns (columns23)'], // Single-cell header row
    cellsRow                 // Row with N columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
