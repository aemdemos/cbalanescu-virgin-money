/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns (should be two: image, content)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (items.length < 2) return;

  // Reference the original elements, do not clone
  const col1 = items[0];
  const col2 = items[1];

  // Build the table
  const headerRow = ['Columns (columns26)'];
  const columnsRow = [col1, col2];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
