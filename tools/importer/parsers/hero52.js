/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero52)'];
  // 2. Background image row: Optional, but NONE present in the supplied HTML
  const backgroundImageRow = [''];

  // 3. Content row: Should contain headline, paragraphs and call-to-action (link)
  // Find the rich text container (may be direct child)
  let contentBlock = null;
  const children = Array.from(element.children);
  // Find the direct child with the rich text, fallback to first child if not found
  contentBlock = children.find(child => child.classList.contains('cm-rich-text')) || children[0];

  // Extract all children that are visible elements: headings, paragraphs including their links
  const contentRowElements = [];
  Array.from(contentBlock.children).forEach((child) => {
    if (/^H[1-6]$/.test(child.tagName) || child.tagName === 'P') {
      contentRowElements.push(child);
    }
  });

  // If contentRowElements is empty, include the contentBlock itself as fallback
  const contentRow = [contentRowElements.length > 0 ? contentRowElements : [contentBlock]];

  // Compose table as per the example: 1 column, 3 rows
  const cells = [headerRow, backgroundImageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
