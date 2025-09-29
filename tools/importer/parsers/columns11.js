/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns11)'];

  // Find the main column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the .sl-list or fallback to direct children
  let slList = columnContainer.querySelector('.sl-list');
  let columnItems = [];
  if (slList) {
    columnItems = Array.from(slList.children).filter((el) => el.classList.contains('sl-item'));
  } else {
    columnItems = Array.from(columnContainer.children);
  }
  if (columnItems.length < 1) return;

  // LEFT COLUMN: card title + image
  const leftColParts = [];
  const leftItem = columnItems[0];
  if (leftItem) {
    // Title (clone to preserve text)
    const title = leftItem.querySelector('.cm-rich-text');
    if (title) leftColParts.push(title.cloneNode(true));
    // Image (clone to preserve alt and src)
    const imgSection = leftItem.querySelector('section.cm-image');
    if (imgSection) {
      leftColParts.push(imgSection.cloneNode(true));
    }
  }

  // RIGHT COLUMN: offer panel(s) + accordion(s)
  const rightColParts = [];
  const rightItem = columnItems[1];
  if (rightItem) {
    // All .cm-content-panel-container (may be more than one)
    const panels = rightItem.querySelectorAll('.cm-content-panel-container');
    panels.forEach(panel => rightColParts.push(panel.cloneNode(true)));
    // All .cm-accordion (may be more than one)
    const accordions = rightItem.querySelectorAll('.cm-accordion');
    accordions.forEach(acc => rightColParts.push(acc.cloneNode(true)));
  }

  // Compose the main content row, ensuring all text content is included
  const contentRow = [leftColParts, rightColParts];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
