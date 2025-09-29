/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the two column items
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // First column: heading
  const firstCol = slItems[0].querySelector('.cm-rich-text');
  // Second column: eligibility list
  const secondCol = slItems[1].querySelector('.cm-rich-text');

  // Defensive: if either is missing, fallback to empty
  const col1 = firstCol ? firstCol : document.createElement('div');
  const col2 = secondCol ? secondCol : document.createElement('div');

  // Build table rows
  const headerRow = ['Columns (columns33)'];
  const contentRow = [col1, col2];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
