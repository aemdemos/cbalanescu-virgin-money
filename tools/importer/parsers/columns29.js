/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we have the header as specified
  const headerRow = ['Columns (columns29)'];

  // Find the column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the .sl-list within the columnContainer
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  // Get all direct children with class .sl-item
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));

  // For each column, extract all its direct children (preserving structure)
  const contentRow = slItems.map((slItem) => {
    // If the column contains multiple content blocks, wrap them in a div
    const children = Array.from(slItem.children);
    if (children.length > 1) {
      const wrapper = document.createElement('div');
      children.forEach(child => wrapper.appendChild(child));
      return wrapper;
    }
    // If column contains only one block, use it directly
    else if (children.length === 1) {
      return children[0];
    }
    // If empty column, use empty string
    return '';
  });

  // Build the table data
  const cells = [
    headerRow,
    contentRow
  ];

  // Create and replace the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
