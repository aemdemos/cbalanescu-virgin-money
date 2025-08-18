/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row as specified
  const headerRow = ['Columns (columns37)'];

  // Get both immediate .sl-item elements (columns)
  const items = Array.from(element.querySelectorAll(':scope .sl-list > .sl-item'));
  if (items.length < 2) return;

  // First column: the heading block - find .cm-rich-text or fallback to item itself
  let leftCol = items[0].querySelector('.cm-rich-text') || items[0];

  // Second column: find the <section class="cm-links-related"> or fallback to item itself
  let rightCol = items[1].querySelector('section.cm-links-related') || items[1];

  const cells = [
    headerRow,
    [leftCol, rightCol],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
