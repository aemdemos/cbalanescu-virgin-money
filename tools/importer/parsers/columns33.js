/* global WebImporter */
export default function parse(element, { document }) {
  // Check for column container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all direct .sl-item children for columns
  const columnItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (columnItems.length < 2) return;

  // For each column cell: reference the .cm-rich-text content
  const rowCells = columnItems.map(item => {
    const richText = item.querySelector('.cm-rich-text');
    return richText || item;
  });

  // Build the table
  const cells = [
    ['Columns (columns33)'], // Header matches example
    rowCells
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
