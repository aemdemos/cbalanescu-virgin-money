/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list block containing the columns
  const slList = element.querySelector('.sl-list');
  const slItems = slList ? Array.from(slList.children) : [];

  // Defensive: If there are no columns, do not create a table
  if (slItems.length === 0) return;

  // Header matches spec exactly
  const headerRow = ['Columns (columns52)'];
  // Compose the columns row: each cell is the main child content from each .sl-item
  const columnsRow = slItems.map(item => {
    // Reference the direct child (block) so we preserve all inner structure and semantics
    return item.firstElementChild;
  });

  // Compose the table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the column container with the new table
  element.replaceWith(table);
}
