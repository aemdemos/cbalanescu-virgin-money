/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .sl-list container for columns
  const slList = element.querySelector('.sl-list');
  let columns = [];

  if (slList) {
    // Get all .sl-item children
    const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
    columns = slItems.map(item => (item.children.length > 0 ? item.children[0] : document.createTextNode('')));
  }

  // If no columns found, fallback to putting entire element in one cell
  if (columns.length === 0) columns = [element];

  // The header row must have the same number of columns as the data row
  // Block name in the first th, rest empty
  const headerRow = ['Columns (columns34)'];
  for (let i = 1; i < columns.length; i++) headerRow.push('');

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columns
  ], document);

  element.replaceWith(table);
}
