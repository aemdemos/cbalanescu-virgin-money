/* global WebImporter */
export default function parse(element, { document }) {
  // The correct header row: single cell, block name
  const headerRow = ['Columns (columns23)'];

  // Find the columns structure: .column-container > .sl > .sl-list > .sl-item
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all .sl-item children of .sl-list
  const slItems = Array.from(slList.children).filter(el => el.classList.contains('sl-item'));
  if (slItems.length === 0) return;

  // Each .sl-item's section is a column cell (for second row)
  const columnsRow = slItems.map(slItem => {
    const section = slItem.querySelector('section');
    return section ? section : document.createElement('div'); // fallback to empty div if missing
  });

  // Structure: header (single cell), then columns (N cells)
  const cells = [headerRow, columnsRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
