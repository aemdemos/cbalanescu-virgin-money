/* global WebImporter */
export default function parse(element, { document }) {
  // Find the list of columns: each .sl-item is a column
  const slList = element.querySelector('.sl-list');
  let items = [];
  if (slList) {
    items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  }

  // Fallback: if structure changes, find all direct children divs that look like columns
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll(':scope > div'));
  }

  // For each column, we want the main content area, or the item itself if not found
  const cells = items.map(item => {
    const colContent = item.querySelector('.cm, .module__content, .cm-rich-text') || item;
    return colContent;
  });

  // Only build a table if we have at least one cell
  if (cells.length > 0) {
    const headerRow = ['Columns (columns18)'];
    const tableData = [headerRow, cells];
    const table = WebImporter.DOMUtils.createTable(tableData, document);
    element.replaceWith(table);
  }
}