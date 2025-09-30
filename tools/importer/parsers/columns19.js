/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the column items
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length === 0) return;

  // Each sl-item contains a content panel. We want the inner content for each column cell.
  const columns = slItems.map((item) => {
    // Find the rich text content inside the panel
    const panel = item.querySelector('.cm-content-panel-container');
    if (!panel) return '';
    // Use the entire panel for resilience (it contains heading and button)
    return panel;
  });

  // Build the table rows
  const headerRow = ['Columns (columns19)'];
  const columnsRow = columns;

  const cells = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
