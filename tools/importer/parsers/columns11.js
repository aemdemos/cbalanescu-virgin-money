/* global WebImporter */
export default function parse(element, { document }) {
  // Check for required structure
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.children);
  if (!slItems.length) return;

  // Header must match example: 'Columns (columns11)'
  const headerRow = ['Columns (columns11)'];

  // Each column is the <section> inside a .sl-item
  const columnsRow = slItems.map(item => {
    // Only reference the section if it exists
    const section = item.querySelector('section');
    return section ? section : item;
  });

  const cells = [headerRow, columnsRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
