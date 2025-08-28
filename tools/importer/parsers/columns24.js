/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block (must match spec exactly)
  const headerRow = ['Columns (columns24)'];

  // Find the column items (sl-item) inside .sl-list
  const slList = element.querySelector('.sl-list');
  let columnsRow = [];

  if (slList) {
    // Get all .sl-item children as columns
    const items = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
    columnsRow = items.map(item => {
      // Prefer the '.cm-rich-text' direct descendant for clear semantics
      const richContent = item.querySelector('.cm-rich-text');
      // If not found, fallback to the sl-item itself (for edge cases)
      return richContent ? richContent : item;
    });
  } else {
    // Fallback if no sl-list: treat direct children as columns
    const directDivs = Array.from(element.querySelectorAll(':scope > div'));
    columnsRow = directDivs.length ? directDivs : [element];
  }

  // Ensure at least one column (avoid empty table)
  if (columnsRow.length === 0) {
    columnsRow = ['']; // empty cell to preserve structure
  }

  // Compose final cells array for block table
  const cells = [headerRow, columnsRow];

  // Replace the original element with the new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
