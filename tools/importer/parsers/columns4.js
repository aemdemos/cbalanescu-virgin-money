/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list block that contains the columns
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Each direct child .sl-item is a column
  const slItems = Array.from(slList.children).filter(item => item.classList.contains('sl-item'));
  if (slItems.length === 0) return;

  // Table rows: first is single header cell, then one row with N columns
  const cells = [];
  cells.push(['Columns (columns4)']);

  // Second row: one cell per column, containing that column's <section> (or fallback to the item)
  const row = slItems.map(item => {
    const section = item.querySelector('section');
    return section || item;
  });
  cells.push(row);

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
