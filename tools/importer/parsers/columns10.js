/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, per instructions and example
  const headerRow = ['Columns (columns10)'];

  // Utility: gather all direct children of sl-item, preserving text and semantic order
  function collectColumnContent(slItem) {
    const items = [];
    slItem.childNodes.forEach(node => {
      if (node.nodeType === 3) { // Text node
        const txt = node.textContent.trim();
        if (txt) {
          const span = document.createElement('span');
          span.textContent = txt;
          items.push(span);
        }
      } else if (node.nodeType === 1) {
        items.push(node);
      }
    });
    // Flatten any nested arrays (e.g. if using arrays of elements)
    return items.length === 1 ? items[0] : items;
  }

  // Identify the multi-column block structure
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // First content row: one cell per column (2 columns in this example)
  const firstRow = slItems.map(collectColumnContent);
  // If only one column, pad to two for block consistency
  while (firstRow.length < 2) firstRow.push('');

  // Second row: look for any panels/accordions that are sibling elements after the columns
  // For this HTML, these are in the second column as extra panels/accordions
  // Find all panels (.cm-content-panel-container) and accordions (.cm-accordion) that are direct children of slList
  // Use only those outside the .sl-item for the second row
  // But in this HTML, extra panels/accordions are inside the second .sl-item
  // Screenshot shows: second row left cell is image, right cell is next panel + accordion
  // So, for the second row, left: card image, right: next content panel + accordion

  // LEFT second row: get card image from first column
  let leftImg = slItems[0]?.querySelector('.cm-image img');
  if (!leftImg && slItems[0]) {
    // fallback: any image
    leftImg = slItems[0].querySelector('img');
  }
  let leftSecondCell = leftImg ? leftImg : '';

  // RIGHT second row: collect content panel (next .cm-content-panel-container) and .cm-accordion(s) in second column
  const rightSecondCellNodes = [];
  if (slItems[1]) {
    // Find all content panels in second column
    const contentPanels = Array.from(slItems[1].querySelectorAll('.cm-content-panel-container'));
    contentPanels.forEach(el => rightSecondCellNodes.push(el));
    // Find all accordions in second column
    const accordions = Array.from(slItems[1].querySelectorAll('.cm-accordion'));
    accordions.forEach(el => rightSecondCellNodes.push(el));
  }
  // Defensive: if nothing found, fallback to all content in second column
  if (rightSecondCellNodes.length === 0 && slItems[1]) {
    rightSecondCellNodes.push(collectColumnContent(slItems[1]));
  }
  const rightSecondCell = rightSecondCellNodes.length === 1 ? rightSecondCellNodes[0] : rightSecondCellNodes;

  // Compose rows
  const rows = [headerRow, firstRow, [leftSecondCell, rightSecondCell]];

  // Remove any empty trailing cells in rows (for robustness)
  rows.forEach(row => {
    for (let i = row.length - 1; i >= 0; i--) {
      if ((typeof row[i] === 'string' && row[i].trim() === '') || row[i] == null) {
        row.splice(i, 1);
      }
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
