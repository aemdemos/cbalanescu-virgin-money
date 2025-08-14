/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns7)'];

  // Get .sl-list inside the element
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    // Each .sl-item is a column
    columns = Array.from(slList.querySelectorAll(':scope > .sl-item')).map((slItem) => {
      // Each .sl-item contains a main content block
      // Use all children of .sl-item for robustness
      const children = Array.from(slItem.children);
      // If only one child, use it directly, else group into a fragment
      if (children.length === 1) {
        return children[0];
      } else if (children.length > 1) {
        // Use a fragment for grouping
        const frag = document.createDocumentFragment();
        children.forEach(child => frag.appendChild(child));
        return frag;
      } else {
        // Edge case: empty .sl-item
        return document.createTextNode('');
      }
    });
  } else {
    // Fallback: treat direct children as columns if .sl-list not present
    columns = Array.from(element.querySelectorAll(':scope > div'));
  }

  // Add header and content row
  const cells = [headerRow, columns];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
