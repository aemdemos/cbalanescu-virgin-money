/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the sl-list (the main columns container)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  // 2. Edge case: Ensure at least 2 columns
  if (slItems.length < 2) return;

  // 3. First column: rich text content block
  const firstCol = slItems[0].querySelector('.cm-rich-text');
  // 4. Second column: image block
  const secondCol = slItems[1].querySelector('figure');
  // 5. Edge case: fallback if elements not found
  if (!firstCol || !secondCol) return;

  // 6. Table header row: exactly one cell as per spec
  const headerRow = ['Columns (columns34)'];

  // 7. Table data row: with as many columns as present in the sl-list
  const dataRow = [firstCol, secondCol];

  // 8. Build cells array
  const cells = [headerRow, dataRow];

  // 9. Build and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
