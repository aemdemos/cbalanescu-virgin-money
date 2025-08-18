/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name
  const headerRow = ['Hero (hero53)'];

  // 2. Background image row: this HTML has no image
  const backgroundImageRow = [''];

  // 3. Content row: heading, subheading, paragraphs, CTA - all from the rich text block
  // Find the rich text/content part
  let contentBlock = element.querySelector('.cm-rich-text, .module__content');
  if (!contentBlock) {
    // fallback, in case content block selector changes in the future
    contentBlock = element.querySelector(':scope > div');
  }

  // Collect all immediate children that are headings or paragraphs
  // (this will preserve semantic meaning and formatting)
  const contentParts = [];
  if (contentBlock) {
    Array.from(contentBlock.children).forEach((child) => {
      // Only include existing elements, not empty whitespace nodes
      if (child.tagName.match(/^H[1-6]$/i) || child.tagName === 'P') {
        contentParts.push(child);
      }
    });
  }

  // Compose block table
  const cells = [
    headerRow,
    backgroundImageRow,
    [contentParts]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
