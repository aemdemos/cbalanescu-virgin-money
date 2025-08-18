/* global WebImporter */
export default function parse(element, { document }) {
  // Table header from the example: 'Columns (columns35)'
  const headerRow = ['Columns (columns35)'];

  // Get the two .sl-item children (columns)
  const slList = element.querySelector('.sl-list');
  const slItems = slList ? Array.from(slList.children) : [];

  // Defensive: Handle missing columns gracefully
  const firstCol = slItems[0]
    ? slItems[0].querySelector('.cm-rich-text') || slItems[0]
    : document.createElement('div');
  let secondCol = slItems[1]
    ? (slItems[1].querySelector('figure') || slItems[1].querySelector('.cm-image') || slItems[1])
    : document.createElement('div');

  // Cells array: header row, then one row with two columns
  const cells = [
    headerRow,
    [firstCol, secondCol]
  ];

  // Create and replace with table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
