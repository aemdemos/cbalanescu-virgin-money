/* global WebImporter */
export default function parse(element, { document }) {
  // Define the table header, matching the block name/variant
  const headerRow = ['Columns (columns5)'];

  // Find sl-list and its children (the two columns)
  const slList = element.querySelector('.sl-list');
  let leftCell = null;
  let rightCell = null;

  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    // Left: image section (reference the section, not just img)
    leftCell = items[0]?.querySelector('section.cm-image') || items[0];
    // Right: rich text content (reference the container div)
    rightCell = items[1]?.querySelector('.cm-rich-text') || items[1];
  }

  // Handle edge cases: fallback if structure is missing
  if (!leftCell && element.children.length > 0) {
    leftCell = element.children[0];
  }
  if (!rightCell && element.children.length > 1) {
    rightCell = element.children[1];
  }

  // Compose the cells array according to the columns block structure
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original block
  element.replaceWith(table);
}
