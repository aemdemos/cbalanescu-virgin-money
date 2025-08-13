/* global WebImporter */
export default function parse(element, { document }) {
  // Find the sl-list (columns container)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Get all immediate column items
  const items = slList.querySelectorAll(':scope > .sl-item');
  const cells = [];
  items.forEach(item => {
    // Each .sl-item > .cq-dd-paragraph > section.cm
    const section = item.querySelector('section.cm');
    if (section) {
      cells.push(section);
    } else {
      cells.push(item); // fallback
    }
  });
  // Table rows: header row with ONE cell, then a row with columns
  const tableRows = [
    ['Columns (columns14)'], // single header cell
    cells // one cell per column
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
