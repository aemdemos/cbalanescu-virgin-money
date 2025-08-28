/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match block name exactly
  const headerRow = ['Columns (columns47)'];

  // Get column containers from the HTML structure
  // The HTML has: .sl-list.has-2-items.has-feature-right > .sl-item (each column)
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
    columns = items.map((item) => {
      // Grab the only direct child of .sl-item, which is the content
      // Reference the child element(s) directly
      const children = Array.from(item.children);
      if (children.length === 1) {
        return children[0];
      }
      // If there are multiple children, return them as an array (rare for this structure, but resilient)
      return children;
    });
  }

  // If no .sl-list found, fallback: treat element's direct children as columns
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }

  // Only create the block if there is content
  if (columns.length > 0) {
    const cells = [
      headerRow,
      columns
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
