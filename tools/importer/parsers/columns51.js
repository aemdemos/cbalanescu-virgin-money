/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children with tag name
  function getDirectChildrenByTag(parent, tag) {
    return Array.from(parent.children).filter(child => child.tagName === tag.toUpperCase());
  }

  // Header row, exactly matching block name
  const headerRow = ['Columns (columns51)'];

  // --- COLUMN DETECTION ---
  // This block is structured as two high-level columns within .sl-list.has-2-items.has-feature-right
  // Each .sl-item in that list is a column
  const mainSlList = element.querySelector('.sl-list.has-2-items.has-feature-right');
  const slItems = mainSlList ? getDirectChildrenByTag(mainSlList, 'div') : [];

  // Prepare cells for each column
  let leftCell = null;
  let rightCellItems = [];

  // --- LEFT COLUMN ---
  if (slItems.length > 0) {
    // The first .sl-item contains .cm-rich-text with h3
    const leftRich = slItems[0].querySelector('.cm-rich-text');
    if (leftRich) {
      leftCell = leftRich;
    }
  }

  // --- RIGHT COLUMN ---
  if (slItems.length > 1) {
    const rightSlItem = slItems[1];
    // Gather all .cm-rich-text elements in this column
    const rightRichTexts = rightSlItem.querySelectorAll('.cm-rich-text');
    rightRichTexts.forEach(el => {
      rightCellItems.push(el);
    });
    // Also check for any nested .column-container with additional rich text (images)
    const nestedColumn = rightSlItem.querySelector('.column-container .sl-list.has-1-item .sl-item .cm-rich-text');
    if (nestedColumn && !rightCellItems.includes(nestedColumn)) {
      rightCellItems.push(nestedColumn);
    }
  }

  // If nothing found, ensure we don't have an empty cell
  if (!leftCell) leftCell = document.createElement('div');
  if (rightCellItems.length === 0) rightCellItems.push(document.createElement('div'));

  // Compose cells array for block table
  const cells = [
    headerRow,
    [leftCell, rightCellItems] // Second row: two columns
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
