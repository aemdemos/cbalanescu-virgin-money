/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns25)'];

  // We'll extract the two columns: icon on the left, accordion on the right
  // The structure is:
  // element > div.column-container > div.sl > div.sl-list > div.sl-item (x2)
  // First sl-item: contains .cm-content-panel-container (the icon)
  // Second sl-item: contains .cm-accordion (the accordion)

  let leftCell = null;
  let rightCell = null;

  // Get all immediate .sl-item children (should be two based on structure)
  const slItems = element.querySelectorAll(':scope > div > div > div.sl-list > div.sl-item');
  // Defensive: fallback to just .sl-item if the above doesn't work
  let items = Array.from(slItems);
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('.sl-item'));
  }

  // Loop through columns, assign left and right cells
  items.forEach((item) => {
    if (!leftCell) {
      const panel = item.querySelector('.cm-content-panel-container');
      if (panel) {
        leftCell = panel;
        return;
      }
    }
    if (!rightCell) {
      const acc = item.querySelector('.cm-accordion');
      if (acc) {
        rightCell = acc;
        return;
      }
    }
  });
  // If any cell is missing, create an empty div for that cell
  if (!leftCell) leftCell = document.createElement('div');
  if (!rightCell) rightCell = document.createElement('div');

  // Compose the rows: header + columns
  const rows = [
    headerRow,
    [leftCell, rightCell],
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(block);
}
