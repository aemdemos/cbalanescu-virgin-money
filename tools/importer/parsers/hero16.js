/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row, as per requirements.
  const headerRow = ['Hero (hero16)'];

  // 2. Second row: background image (none in provided HTML, so empty string for cell)
  const imageRow = [''];

  // 3. Third row: title, subheading, CTA, etc. In this HTML, it's just a centered CTA paragraph.
  // Reference the paragraph element directly if present, else empty string (edge case coverage)
  const p = element.querySelector('p');
  const contentRow = [p ? p : ''];

  // Compose table rows
  const rows = [headerRow, imageRow, contentRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
