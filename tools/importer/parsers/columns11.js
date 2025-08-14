/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we have the sl-list (source for columns)
  const slList = element.querySelector('.sl-list');
  const slItems = slList ? Array.from(slList.children) : [];
  // Defensive: if no columns, do nothing
  if (slItems.length === 0) return;

  // Header row exactly matching block name
  const headerRow = ['Columns (columns11)'];

  // Each column: reference the section directly for all content (heading, list)
  const columnCells = slItems.map(item => {
    const section = item.querySelector('section.cm');
    return section || item;
  });

  // Table structure: header row, then columns row
  const cells = [headerRow, columnCells];

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
