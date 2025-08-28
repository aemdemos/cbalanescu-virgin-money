/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: must match exactly
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row (none in this HTML, so empty string)
  const backgroundRow = [''];

  // 3. Content row: collect all relevant children into a single cell
  // The content is inside a child with class 'cm-rich-text', but the HTML might vary, so be resilient
  let contentContainer = null;
  const children = element.querySelectorAll(':scope > div');
  for (const child of children) {
    if (child.classList.contains('cm-rich-text')) {
      contentContainer = child;
      break;
    }
  }
  if (!contentContainer) contentContainer = element;

  // Only immediate children that are visible/meaningful
  // Filter out empty text nodes
  const contentElements = Array.from(contentContainer.childNodes).filter(node => {
    if (node.nodeType === 1) return true; // element node
    if (node.nodeType === 3 && node.textContent.trim()) return true; // non-empty text
    return false;
  });

  // Place all content elements in a single cell (array for createTable)
  const contentRow = [contentElements];

  // Create the table: 1 column, 3 rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    backgroundRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
