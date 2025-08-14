/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell with the exact block name
  const headerRow = ['Columns (columns29)'];

  // Find the column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find all direct .sl-item children (the columns)
  const slItems = columnContainer.querySelectorAll(':scope > .sl > .sl-list > .sl-item');
  const columns = [];
  slItems.forEach((item) => {
    // Left cell: stack all .cm-rich-text as one cell (array of elements)
    const richTexts = Array.from(item.querySelectorAll(':scope > .cm-rich-text'));
    if (richTexts.length) {
      columns.push(richTexts);
      return;
    }
    // Right cell: .cm-image section if present
    const image = item.querySelector(':scope > .cm-image');
    if (image) {
      columns.push(image);
      return;
    }
    // Otherwise, put all children together
    columns.push(Array.from(item.children));
  });

  // Compose table: header row (single cell), then content row (n cells)
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
