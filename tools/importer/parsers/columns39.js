/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as a single-cell array, per the spec
  const headerRow = ['Columns (columns39)'];

  // Find the column items
  const slList = element.querySelector('.sl-list');
  let columnDivs = [];
  if (slList) {
    columnDivs = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  }
  if (!columnDivs.length) {
    columnDivs = [element];
  }

  // Extract content panels from each column
  const columnsRow = columnDivs.map(col => {
    const panel = col.querySelector('.cm-content-panel-container');
    return panel ? panel : col;
  });

  // Compose table: header row is single column, next row contains all columns
  const tableData = [
    headerRow,
    columnsRow
  ];

  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
