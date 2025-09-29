/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns6)'];

  // Defensive: find the main list of columns
  // The structure is: .column-container > .sl > .sl-list > .sl-item (x3)
  // Each .sl-item contains a <section> with a heading and a <ul> of links
  const slList = element.querySelector('.sl-list');
  let columnCells = [];
  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    columnCells = Array.from(items).map(item => {
      // Each item contains a <section> with the column content
      const section = item.querySelector('section');
      // Defensive: use the section if available, else the item itself
      return section || item;
    });
  }

  // Only create the table if we have at least one column
  if (columnCells.length > 0) {
    const rows = [
      headerRow,
      columnCells
    ];
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
