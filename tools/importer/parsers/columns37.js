/* global WebImporter */
export default function parse(element, { document }) {
  // Define header as per instructions
  const headerRow = ['Columns (columns37)'];

  // Find columns by immediate .sl-list > .sl-item
  const slList = element.querySelector('.sl-list');
  const items = Array.from(slList ? slList.children : []);

  // Defensive: if no columns found, abort
  if (items.length === 0) return;

  // Each column is the full content panel (as per guidelines)
  const columns = items.map(item => {
    // Find the panel container (always present)
    const panel = item.querySelector('.cm-content-panel-container');
    // Defensive: fallback to item if no panel
    return panel || item;
  });

  // Build the cells array for the table
  const cells = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block table
  element.replaceWith(block);
}
