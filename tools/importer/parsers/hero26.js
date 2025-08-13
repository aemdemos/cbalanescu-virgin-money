/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: block name as specified
  const headerRow = ['Hero (hero26)'];

  // Row 2: Background image (none present in this HTML)
  const bgRow = [''];

  // Row 3: Content: select the rich text container for all relevant text, headings, and CTAs
  let contentBlock = null;
  const children = element.querySelectorAll(':scope > div');
  for (const child of children) {
    if (child.classList.contains('cm-rich-text')) {
      contentBlock = child;
      break;
    }
  }
  if (!contentBlock) {
    // If not found, fallback to the element itself (should never happen with example HTML)
    contentBlock = element;
  }

  // Compose table rows as per markdown/example structure
  const cells = [
    headerRow,
    bgRow,
    [contentBlock],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block
  element.replaceWith(table);
}
