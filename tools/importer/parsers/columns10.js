/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child .sl-item elements
  let columnContainer = element.querySelector('.column-container');
  if (!columnContainer) columnContainer = element;

  let slList = columnContainer.querySelector('.sl-list');
  if (!slList) slList = columnContainer;

  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // Build columns for the second row
  // Each cell will be an array of all immediate children of each .sl-item
  const columns = slItems.map(item => {
    // Get all direct children
    const children = Array.from(item.children);
    return children.length === 1 ? children[0] : children;
  });

  // Compose table
  // Header: exactly as specified
  const headerRow = ['Columns (columns10)'];
  const cells = [
    headerRow,
    columns
  ];

  // There is no Section Metadata block in the example, so don't add any extra table or <hr>

  // Use only existing elements for cells, never clones or string HTML

  // Replace the original element with the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
