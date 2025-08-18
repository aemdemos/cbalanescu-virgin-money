/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matches the example exactly
  const headerRow = ['Columns (columns3)'];

  // 2. Get the main columns. According to the HTML, each .sl-item is a column.
  const slList = element.querySelector('.sl-list');
  const items = slList ? slList.querySelectorAll(':scope > .sl-item') : [];

  // Expecting two columns: one image, one rich text
  // Column 1: .cm-image section
  let col1 = null;
  // Column 2: .cm-rich-text div
  let col2 = null;

  if (items.length > 0) {
    // Look for cm-image in first column
    const imageSection = items[0].querySelector('.cm-image');
    if (imageSection) {
      col1 = imageSection;
    } else {
      col1 = items[0]; // fallback: entire item
    }
  }

  if (items.length > 1) {
    const richTextSection = items[1].querySelector('.cm-rich-text');
    if (richTextSection) {
      col2 = richTextSection;
    } else {
      col2 = items[1]; // fallback: entire item
    }
  }

  // Edge cases: If only one column exists, fill other as empty
  if (!col1) col1 = document.createElement('div');
  if (!col2) col2 = document.createElement('div');

  // 3. Compose content row
  const contentRow = [col1, col2];

  // 4. Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace in DOM
  element.replaceWith(block);
}
