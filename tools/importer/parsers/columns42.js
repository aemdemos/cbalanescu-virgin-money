/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in instructions
  const headerRow = ['Columns (columns42)'];

  // Defensive: Find all .sl-item children (columns)
  const slItems = element.querySelectorAll('.sl-list > .sl-item');

  // Each column is a cell: gather all .cm-icon-title sections for that column
  const columnCells = Array.from(slItems).map((col) => {
    // Get all .cm-icon-title sections inside this column
    const sections = Array.from(col.querySelectorAll('.cm-icon-title'));
    // If there are no sections, add an empty cell
    if (sections.length === 0) return '';
    // If only one section, put the element directly as cell
    if (sections.length === 1) return sections[0];
    // If multiple, put them all in an array in the cell
    return sections;
  });

  // Table rows: header + content row
  const rows = [headerRow, columnCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
