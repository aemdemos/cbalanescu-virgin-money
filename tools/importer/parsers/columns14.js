/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct .sl-item blocks (each is a column)
  const items = element.querySelectorAll('.sl-list > .sl-item');

  // Correct header row: one cell only
  const headerRow = ['Columns (columns14)'];

  // Content row: one cell per column (section)
  const columnsRow = Array.from(items).map(item => {
    const section = item.querySelector('section.cm-image-block-link');
    return section ? section : '';
  });

  // Only one cell in header row, then as many columns as needed in second row
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(block);
}
