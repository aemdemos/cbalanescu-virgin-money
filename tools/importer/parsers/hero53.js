/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as per example
  const headerRow = ['Hero (hero53)'];

  // 2. Background image row (none present in this HTML)
  const imageRow = [''];

  // 3. Content row: reference the rich text block
  // Find the content block inside our element
  const contentBlock = element.querySelector('.cm-rich-text.module__content');
  // Edge case: if contentBlock is missing, create an empty content cell
  const contentRow = [contentBlock ? contentBlock : ''];

  // Assemble the cells as per required structure: 1 column, 3 rows
  const cells = [headerRow, imageRow, contentRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table block
  element.replaceWith(block);
}
