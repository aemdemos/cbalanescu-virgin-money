/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Columns (columns54)'];

  // Find the two columns in the top-level .sl-list
  const mainSlList = element.querySelector(':scope > .sl > .sl-list.has-2-items');
  if (!mainSlList) return;
  const mainSlItems = Array.from(mainSlList.querySelectorAll(':scope > .sl-item'));
  if (mainSlItems.length !== 2) return;

  // Helper to extract ALL content (text nodes, images, figures, lists, etc.) from each inner column cell
  function extractColumnContent(colItem) {
    // Find the .sl-list.has-4-items inside the column
    const innerSlList = colItem.querySelector(':scope > .column-container > .sl > .sl-list.has-4-items');
    if (!innerSlList) return [];
    // For each sl-item, include ALL children, preserving semantic structure and text
    return Array.from(innerSlList.querySelectorAll(':scope > .sl-item')).map(item => {
      const cellContent = [];
      // Include all element children (sections, figures, images, etc.)
      Array.from(item.children).forEach(child => {
        cellContent.push(child);
      });
      // Include all non-empty text nodes DIRECTLY under .sl-item
      Array.from(item.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const txt = node.textContent.trim();
          if (txt) cellContent.push(document.createTextNode(txt));
        }
      });
      // If no children, use item itself
      if (cellContent.length === 0) return item;
      // If only one child, return it directly, else array
      return cellContent.length === 1 ? cellContent[0] : cellContent;
    });
  }

  // Get all blocks for left and right columns
  const leftBlocks = extractColumnContent(mainSlItems[0]);
  const rightBlocks = extractColumnContent(mainSlItems[1]);

  // Defensive check: Expect 4 blocks per column
  if (leftBlocks.length !== 4 || rightBlocks.length !== 4) return;

  // Organize per example: two rows, two columns, each cell can have multiple elements
  const cells = [
    headerRow,
    [ [leftBlocks[0], leftBlocks[1]], [rightBlocks[0], rightBlocks[1]] ],
    [ [leftBlocks[2], leftBlocks[3]], [rightBlocks[2], rightBlocks[3]] ]
  ];

  // Create the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
