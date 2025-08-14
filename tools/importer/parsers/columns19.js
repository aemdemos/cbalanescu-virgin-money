/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must match the block name exactly
  const headerRow = ['Columns (columns19)'];

  // Find the main column container
  const colContainer = element.querySelector('.column-container');
  let columns = [];

  if (colContainer) {
    // Try to find the .sl-list (contains .sl-item columns)
    const slList = colContainer.querySelector('.sl-list');
    if (slList) {
      // Each .sl-item = a column
      const slItems = slList.querySelectorAll(':scope > .sl-item');
      slItems.forEach((slItem) => {
        // Collect all content from this column in order
        let colContent = [];
        // Include all child nodes (including text)
        Array.from(slItem.childNodes).forEach(node => {
          // Only add non-empty text nodes and all elements
          if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim()) colContent.push(document.createTextNode(node.textContent));
          } else {
            colContent.push(node);
          }
        });
        // Fallback to slItem itself if no content extracted
        if (!colContent.length) colContent.push(slItem);
        // Use array if >1, else just the node
        columns.push(colContent.length === 1 ? colContent[0] : colContent);
      });
    } else {
      // If no .sl-list, treat .column-container direct children as columns
      const children = Array.from(colContainer.children);
      children.forEach(child => {
        columns.push(child);
      });
      // If no children, fallback to .column-container itself
      if (!columns.length) columns.push(colContainer);
    }
  } else {
    // Fallback: treat direct children of element as columns
    const children = Array.from(element.children);
    children.forEach(child => {
      columns.push(child);
    });
    // If no children, fallback to element itself
    if (!columns.length) columns.push(element);
  }

  // Table must have header as single cell, then one row of columns
  const cells = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
