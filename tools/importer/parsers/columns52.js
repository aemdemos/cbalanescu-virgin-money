/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main columns structure
  // The left content is the first .sl-item (with .cm-rich-text)
  // The right column is the second .sl-item (with multiple .cm-icon-title)
  const paragraphContainer = element.querySelector('.column-container .sl-list');
  if (!paragraphContainer) return;
  // Get immediate .sl-item children
  const items = paragraphContainer.querySelectorAll(':scope > .sl-item');

  // Defensive: If no items, abort
  if (items.length < 1) return;

  // Left column: .cm-rich-text block, if present
  let leftContent = null;
  if (items[0]) {
    leftContent = items[0].querySelector('.cm-rich-text');
    // Defensive: If not found, fallback to whole item content
    if (!leftContent) leftContent = items[0];
  }

  // Right column: multiple .cm-icon-title sections
  let rightContentArray = [];
  if (items.length > 1 && items[1]) {
    const iconSections = items[1].querySelectorAll('.cm-icon-title');
    if (iconSections.length === 0) {
      // Fallback: use all children of items[1]
      rightContentArray = Array.from(items[1].children);
    } else {
      rightContentArray = Array.from(iconSections);
    }
  }

  // 2. Create the block table
  const headerRow = ['Columns (columns52)']; // Must match example
  const columnsRow = [leftContent, rightContentArray]; // 2 columns as shown in screenshot & example
  const cells = [headerRow, columnsRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
