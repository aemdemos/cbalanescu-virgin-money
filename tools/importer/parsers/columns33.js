/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns33)'];

  // The structure is: .column-container > .sl > .sl-list > .sl-item > .cm
  // We want the immediate .sl-item children of .sl-list
  const slList = element.querySelector('.sl-list');
  let columns = [];

  if (slList) {
    // Each .sl-item should have the content for each column
    columns = Array.from(slList.children).map((slItem) => {
      // Find the first direct child with class .cm (content module)
      const content = slItem.querySelector('.cm');
      return content ? content : document.createTextNode('');
    });
  }
  
  // If no columns found, don't do anything
  if (columns.length === 0) {
    return;
  }

  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
