/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns list
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Get direct .sl-item children (each column)
  const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (items.length === 0) return;

  // For each column, reference the content panel container (preserves all markup)
  const columns = items.map(item => {
    const panel = item.querySelector('.cm-content-panel-container');
    // Defensive: if missing, create empty cell
    return panel ? panel : document.createElement('div');
  });

  // Build the table: header row, then one row with all columns
  const headerRow = ['Columns (columns37)'];
  const contentRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
