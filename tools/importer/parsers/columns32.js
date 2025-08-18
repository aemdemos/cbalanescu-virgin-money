/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header as per block requirements
  const headerRow = ['Columns (columns32)'];

  // Find the columns in the source HTML
  let columns = [];
  const slList = element.querySelector('.sl-list.has-2-items');
  if (slList) {
    const slItems = slList.querySelectorAll(':scope > .sl-item');
    // Defensive: ensure we have at least two columns for a columns32 block
    if (slItems.length >= 2) {
      // First column: image/content block (the entire .cm-content-panel-container for robustness)
      const firstPanel = slItems[0].querySelector('.cm-content-panel-container');
      columns.push(firstPanel || slItems[0]);

      // Second column: rich text block (the entire .cm-rich-text)
      const secondRich = slItems[1].querySelector('.cm.cm-rich-text');
      columns.push(secondRich || slItems[1]);
    } else {
      // If not enough columns, just push whatever exists (for resilience)
      slItems.forEach(item => columns.push(item));
    }
  } else {
    // Fallback: if not found, put the element itself
    columns.push(element);
  }

  const tableCells = [
    headerRow,
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
