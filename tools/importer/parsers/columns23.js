/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell
  const headerRow = ['Columns (columns23)'];

  // Find the .sl-list (container for column items)
  const list = element.querySelector('.sl-list');
  if (!list) return;

  // Get all .sl-item direct children (each is a column)
  const items = Array.from(list.children).filter(child => child.classList.contains('sl-item'));

  // For each column, reference the section inside
  const columnCells = items.map(item => {
    const section = item.querySelector('section');
    return section || item;
  });

  // The second row: a single array, with each column as a cell
  const tableData = [headerRow, columnCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(block);
}
