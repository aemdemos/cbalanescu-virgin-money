/* global WebImporter */
export default function parse(element, { document }) {
  // Find columns
  let columns = [];
  const slList = element.querySelector('.sl-list.has-2-items');
  if (slList) {
    const slItems = slList.querySelectorAll(':scope > .sl-item');
    if (slItems.length === 2) {
      columns = [slItems[0], slItems[1]];
    } else {
      columns = Array.from(slList.children);
    }
  } else {
    columns = Array.from(element.querySelectorAll(':scope > .sl-item'));
    if (columns.length === 0) {
      columns = [element];
    }
  }
  columns = columns.filter((col) => col && (col.textContent.trim() || col.querySelector('img')));
  // Create table using DOMUtils
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns32)'],
    columns,
  ], document);
  // Set correct colspan for the header row
  const headerTr = table.querySelector('tr:first-child');
  if (headerTr && columns.length > 1) {
    const headerCell = headerTr.querySelector('th');
    if (headerCell) {
      headerCell.setAttribute('colspan', columns.length);
    }
  }
  // Replace original element
  element.replaceWith(table);
}
