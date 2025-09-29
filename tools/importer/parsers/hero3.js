/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero3) block: 1 column, 3 rows

  // 1. Header row
  const headerRow = ['Hero (hero3)'];

  // 2. Background image row (always present, even if empty)
  const imageRow = [''];

  // 3. Content row: gather all text content from the element (not just children)
  // Use textContent to ensure all text is included in the cell
  const text = element.textContent.trim();
  const contentRow = [text ? text : ''];

  // Build table: must have 3 rows
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block table
  element.replaceWith(block);
}
