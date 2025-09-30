/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by block spec
  const headerRow = ['Columns (columns13)'];

  // Find the column container and its immediate children (the columns)
  const columnContainer = element.querySelector('.column-container');
  let columns = [];
  if (columnContainer) {
    // Find the .sl-list which contains the .sl-item columns
    const slList = columnContainer.querySelector('.sl-list');
    if (slList) {
      columns = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
    }
  }

  // Defensive: fallback to all direct .sl-item children if not found
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('.sl-item'));
  }

  // For each column, extract its main content element (image or rich text)
  const contentRow = columns.map(col => {
    // If the column contains a section (image), use it; else, use the first child
    let mainContent = col.querySelector('section, .cm-rich-text, div');
    if (!mainContent) mainContent = col;
    return mainContent;
  });

  // Build the table rows
  const rows = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
