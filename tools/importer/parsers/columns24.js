/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate column items
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    // Get direct child .sl-item elements (columns)
    const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
    columns = items.map((item) => {
      // Each .sl-item contains a .cm-rich-text module__content
      const content = item.querySelector('.cm-rich-text');
      // Defensive: fallback to item itself if not found
      return content || item;
    });
  }
  // Table header row
  const headerRow = ['Columns (columns24)'];
  // Table columns row: each column's content in its own cell
  const columnsRow = columns.length ? columns : [element];
  // Compose table data
  const tableData = [headerRow, columnsRow];
  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  // Replace original element
  element.replaceWith(block);
}
