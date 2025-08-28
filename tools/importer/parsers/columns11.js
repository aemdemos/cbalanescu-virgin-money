/* global WebImporter */
export default function parse(element, { document }) {
  // Identify the columns block structure
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;
  const sl = columnContainer.querySelector('.sl');
  if (!sl) return;
  const slList = sl.querySelector('.sl-list');
  if (!slList) return;
  const columns = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // Table header (exactly as required)
  const headerRow = ['Columns (columns11)'];

  // Build column cells
  // Each column is a .sl-item. For resilience, include all its children (elements and non-empty text nodes)
  const cellsRow = columns.map((col) => {
    // Collect all meaningful children from each column
    const children = Array.from(col.childNodes).filter(node => {
      // Keep non-empty text nodes or element nodes
      if (node.nodeType === 3) return node.textContent.trim();
      if (node.nodeType === 1) return true;
      return false;
    });
    // If only one child, use it directly; else, group all
    if (children.length === 1) {
      return children[0];
    } else {
      return children;
    }
  });

  // Create a columns block table matching the example
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellsRow
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
