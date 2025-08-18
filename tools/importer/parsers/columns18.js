/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row - matches exact block name
  const headerRow = ['Columns (columns18)'];

  // 2. Extract columns
  // The main columns are the direct children of .sl-list
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    // Each .sl-item is a column
    columns = Array.from(slList.children).map((slItem) => {
      // Find the rich text content inside the column
      const richContent = slItem.querySelector('.cm-rich-text, .cm.cm-rich-text');
      // Reference the content block if present, otherwise the sl-item itself
      return richContent ? richContent : slItem;
    });
  } else {
    // Fallback: for generality, if .sl-list not found, use direct children
    columns = Array.from(element.children);
  }

  // Defensive: If no columns, fallback to whole element
  if (columns.length === 0) {
    columns = [element];
  }

  // 3. Table rows array: header, then the columns row
  const tableRows = [headerRow, columns];

  // 4. Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
