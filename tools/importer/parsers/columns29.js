/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column container
  const columnContainer = element.querySelector('.column-container');
  let columns = [];

  if (columnContainer) {
    const slList = columnContainer.querySelector('.sl-list');
    if (slList) {
      const slItems = slList.querySelectorAll(':scope > .sl-item');
      columns = Array.from(slItems).map((slItem) => {
        // Each sl-item may have 1 or more children
        const children = Array.from(slItem.children);
        if (children.length === 1) {
          return children[0];
        } else if (children.length > 1) {
          return children;
        }
        return '';
      });
    }
  }
  // Fallback: put entire element in one cell if columns not found
  if (columns.length < 2) {
    columns = [element];
  }
  // Compose cells: header row (exactly one cell), then columns row
  const cells = [
    ['Columns (columns29)'], // fix: header row is always 1 cell only
    columns // columns row: as many columns as needed
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
