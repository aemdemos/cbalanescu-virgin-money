/* global WebImporter */
export default function parse(element, { document }) {
  // Header matches exactly as required
  const headerRow = ['Columns (columns2)'];

  // Safely find the columns
  let columns = [];
  // The main list container for columns
  const list = element.querySelector('.sl-list.has-2-items');
  if (list) {
    const items = Array.from(list.children).filter(child => child.classList.contains('sl-item'));
    // Each sl-item contains a .cm-rich-text block
    columns = items.map(item => {
      // Reference the full .cm-rich-text block for semantic/format resilience
      const content = item.querySelector('.cm-rich-text');
      // If missing, safe fallback to empty div
      return content ? content : document.createElement('div');
    });
    // Ensure exactly 2 columns
    while (columns.length < 2) {
      columns.push(document.createElement('div'));
    }
    columns = columns.slice(0,2);
  } else {
    // Fallback: get .cm-rich-text blocks directly from container
    const richTexts = element.querySelectorAll('.cm-rich-text');
    columns = Array.from(richTexts);
    while (columns.length < 2) {
      columns.push(document.createElement('div'));
    }
    columns = columns.slice(0,2);
  }

  // Table rows: header, then the columns as a row
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
