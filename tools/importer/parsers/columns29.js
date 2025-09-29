/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the .sl-list (row of columns)
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  // Get all direct .sl-item children (columns)
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length === 0) return;

  // For each column, collect its content as a single element or fragment
  const columns = slItems.map((item) => {
    // If only one child, use it directly
    if (item.children.length === 1) {
      return item.children[0];
    }
    // Otherwise, wrap all children in a fragment
    const frag = document.createDocumentFragment();
    Array.from(item.children).forEach(child => frag.appendChild(child));
    return frag;
  });

  // Table header must match block name exactly
  const headerRow = ['Columns (columns29)'];
  const contentRow = columns;

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
