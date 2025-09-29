/* global WebImporter */
export default function parse(element, { document }) {
  // Find all columns in the .sl-list
  const slList = element.querySelector('.sl-list');
  const slItems = slList ? Array.from(slList.children) : [];

  // Defensive: fallback to any .sl-item in the block if .sl-list is missing
  const columns = slItems.length ? slItems : Array.from(element.querySelectorAll(':scope .sl-item'));

  // For each column, extract the main content section (the <section> inside)
  const columnCells = columns.map((col) => {
    // Find the .cm-image-block-link section (should be only one per column)
    const section = col.querySelector('section.cm-image-block-link');
    // Defensive: If not found, fallback to the whole column
    return section || col;
  });

  // Build the table rows
  const headerRow = ['Columns (columns31)'];
  const contentRow = columnCells;

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
