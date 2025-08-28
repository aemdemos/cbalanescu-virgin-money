/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block name row (header)
  const headerRow = ['Hero (hero54)'];

  // 2. Background image row (none in this HTML, so empty)
  const backgroundRow = [''];

  // 3. Content row: Reference the container that contains all rich text content
  // The module__content div contains heading, paragraph, and CTA link
  let contentDiv = null;
  // Find the direct child with class 'cm-rich-text'
  const directChildren = element.querySelectorAll(':scope > div');
  for (const child of directChildren) {
    if (child.classList.contains('cm-rich-text')) {
      contentDiv = child;
      break;
    }
  }
  // Fallback: use the element itself if not found
  if (!contentDiv) contentDiv = element;

  // 4. Compose the table for the block
  const cells = [
    headerRow,
    backgroundRow,
    [contentDiv],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
