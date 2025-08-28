/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct .sl-item children (columns)
  const items = element.querySelectorAll('.sl-list > .sl-item');
  // Defensive: if not at least two columns, fallback
  if (items.length < 2) return;

  // Collect each column's section content
  const contentRow = [];
  items.forEach(item => {
    const section = item.querySelector('.cm-image-block-link');
    if (section) {
      contentRow.push(section);
    } else {
      contentRow.push(document.createTextNode(''));
    }
  });

  // Header row: single cell, exactly as in the example
  const headerRow = ['Columns (columns31)'];

  // Compose table: header is one cell, content is N columns
  const tableCells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
