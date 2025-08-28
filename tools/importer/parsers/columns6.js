/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list holding all column items
  const slList = element.querySelector('.sl-list');
  const columns = slList ? Array.from(slList.children) : [];
  // Each column: get its section (contains heading and list of links)
  const columnCells = columns.map(col => {
    const section = col.querySelector('section') || col;
    return section;
  });
  // Prepare table rows: header (single cell) and one row of columns
  const cells = [
    ['Columns (columns6)'], // header row: SINGLE COLUMN
    columnCells // second row: one cell per column
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
