/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, per example
  const headerRow = ['Columns (columns53)'];

  // Find the main column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Inside columnContainer, the two visual columns:
  // Left: .sl-list > .sl-item (first) -> .cm-rich-text (heading)
  // Right: .sl-list > .sl-item (second) -> all .cm-icon-title sections

  // Left column: Get heading block (should be h3 inside .cm-rich-text)
  let leftCol = null;
  const slList = columnContainer.querySelector('.sl-list');
  if (slList) {
    const slItems = slList.querySelectorAll(':scope > .sl-item');
    if (slItems.length > 0) {
      const richText = slItems[0].querySelector('.cm-rich-text');
      if (richText) leftCol = richText;
      else leftCol = slItems[0];
    }
    // Right column: collect all icon-title sections from second sl-item
    let rightCol = null;
    if (slItems.length > 1) {
      // There may be multiple sections inside
      const iconTitleSections = slItems[1].querySelectorAll('.cm-icon-title');
      if (iconTitleSections.length > 0) {
        // Group in a wrapper div
        rightCol = document.createElement('div');
        iconTitleSections.forEach(section => {
          rightCol.appendChild(section);
        });
      } else {
        // fallback: use entire second sl-item
        rightCol = slItems[1];
      }
      // Build the cells: [leftCol, rightCol]
      const tableRows = [headerRow, [leftCol, rightCol]];
      const block = WebImporter.DOMUtils.createTable(tableRows, document);
      element.replaceWith(block);
    }
  }
}
