/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main two columns (the direct children of .sl-list.has-2-items)
  const firstLevelList = element.querySelector('.column-container > .sl > .sl-list.has-2-items');
  if (!firstLevelList) return;
  const columnItems = Array.from(firstLevelList.children);
  // Defensive: do nothing if no columns found
  if (columnItems.length === 0) return;
  // Build the columns12 block table as per spec
  const cells = [
    ['Columns (columns12)'],
    columnItems.map((col) => col)
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}