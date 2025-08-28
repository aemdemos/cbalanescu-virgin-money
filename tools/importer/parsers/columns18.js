/* global WebImporter */
export default function parse(element, { document }) {
  // Get the top-level columns (should be 3)
  const columns = Array.from(element.querySelectorAll(':scope > ul.nav-footer > li'));
  // Header row: only one cell, exactly matching the example
  const headerRow = ['Columns (columns18)'];
  // Second row: each column is a cell
  const contentRow = columns;
  const cells = [
    headerRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}