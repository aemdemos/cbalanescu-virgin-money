/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main column container
  const columnContainer = element.querySelector('.column-container') || element;
  // Find the .sl-list inside columnContainer
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // Left column: rich text (heading)
  let leftCell = slItems[0].querySelector('.cm-rich-text') || slItems[0];

  // Right column: all .cm-icon-title sections
  const iconSections = slItems[1].querySelectorAll('.cm-icon-title');
  let rightCell;
  if (iconSections.length > 0) {
    // Create a wrapper div to preserve semantic grouping
    rightCell = document.createElement('div');
    iconSections.forEach(section => {
      rightCell.appendChild(section);
    });
  } else {
    rightCell = slItems[1];
  }

  // Table header: must match target block name exactly
  const headerRow = ['Columns (columns53)'];
  const contentRow = [leftCell, rightCell];

  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
