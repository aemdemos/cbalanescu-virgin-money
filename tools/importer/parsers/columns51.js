/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (one column), per requirements
  const headerRow = ['Columns (columns51)'];

  // Find columns
  let columns = [];
  const slList = element.querySelector('.sl-list');
  if (slList) {
    columns = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  } else {
    columns = Array.from(element.querySelectorAll(':scope > .sl-item'));
  }
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }
  // For each column, grab the main relevant content
  const rowCells = columns.map(col => {
    const section = col.querySelector(':scope > section');
    if (section) return section;
    const richText = col.querySelector(':scope > div.cm-rich-text, :scope > div.cm.cm-rich-text');
    if (richText) return richText;
    return col.firstElementChild || col;
  });

  // The table must have one header row (single cell), then one row with n data columns
  const cells = [headerRow, rowCells];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
