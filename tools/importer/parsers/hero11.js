/* global WebImporter */
export default function parse(element, { document }) {
  // Block header matches the example exactly
  const headerRow = ['Hero (hero11)'];

  // There is no image/background image element in the provided HTML, so blank cell as per block definition
  const imageRow = [''];

  // Find the main content div (should be the rich text block)
  let richTextDiv = null;
  const children = element.querySelectorAll(':scope > div');
  for (const child of children) {
    if (child.classList.contains('cm-rich-text')) {
      richTextDiv = child;
      break;
    }
  }

  // Fallback: if not found, use the whole element so no content is lost
  const contentCell = richTextDiv || element;

  // Compose table rows (all content in one cell for the 3rd row)
  const cells = [
    headerRow,
    imageRow,
    [contentCell],
  ];

  // Create and replace the original element with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
