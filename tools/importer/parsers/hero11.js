/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row, as specified in the block name
  const headerRow = ['Hero (hero11)'];

  // 2. Background row: this HTML does NOT contain a background image, so leave cell empty
  const backgroundRow = [''];

  // 3. Content row: collect all meaningful children (headings, paragraphs, links, etc)
  // Content is inside .cm-rich-text (first child div)
  const contentWrapper = element.querySelector('.cm-rich-text');
  // Defensive: if wrapper missing, just use the original element
  const wrapper = contentWrapper || element;
  // Get all child nodes that are not empty text nodes
  const contentNodes = Array.from(wrapper.childNodes).filter(
    node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
  );
  const contentRow = [contentNodes];

  // Compose table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
