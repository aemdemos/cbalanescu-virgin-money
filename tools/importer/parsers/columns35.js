/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container (.sl-list) and its direct children (.sl-item)
  const slList = element.querySelector('.sl-list');
  let col1 = null;
  let col2 = null;

  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    // First column: rich text content
    if (items[0]) {
      const rich = items[0].querySelector('.cm-rich-text') || items[0];
      col1 = rich;
    }
    // Second column: image content (just the image)
    if (items[1]) {
      const img = items[1].querySelector('img');
      col2 = img || items[1];
    }
  }

  // Fallbacks
  if (!col1 && !col2) {
    col1 = element;
    col2 = '';
  } else if (!col1) {
    col1 = '';
  } else if (!col2) {
    col2 = '';
  }

  // Build cells for createTable
  // Fix: Header row must be single cell, but rendered with colspan=2
  const headerRow = [document.createTextNode('Columns (columns35)')];
  const cells = [
    headerRow,
    [col1, col2]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Set colspan=2 on the header cell to span both columns
  const headerTr = table.querySelector('tr:first-child');
  const headerTh = headerTr ? headerTr.querySelector('th') : null;
  if (headerTh) {
    headerTh.setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
