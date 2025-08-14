/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly
  const headerRow = ['Columns (columns32)'];

  // 2. Find the content columns: .sl-list > .sl-item (each is a column)
  const slList = element.querySelector('.sl-list');
  let columns = [];

  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    items.forEach((item) => {
      // For each column, find the richest container
      // First column is a content panel with image
      const contentPanel = item.querySelector('.cm-content-panel-container');
      if (contentPanel) {
        columns.push(contentPanel);
        return;
      }
      // Second column has .cm-rich-text (heading, paragraphs, link)
      const richText = item.querySelector('.cm-rich-text');
      if (richText) {
        columns.push(richText);
        return;
      }
      // Fallback - if neither is found, use the item itself
      columns.push(item);
    });
  }

  // 3. Edge case: if columns are empty, create one empty cell for correct column count
  if (columns.length === 0) {
    columns = [''];
  }

  // 4. Build table array
  const tableArray = [headerRow, columns];

  // 5. Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}
