/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header
  const headerRow = ['Columns (columns27)'];

  // Find the columns by locating .sl-list > .sl-item elements
  const slList = element.querySelector('.sl-list');
  let columnCells = [];

  if (slList) {
    const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
    // For each column, reference its .cm.cm-rich-text.module__content.l-full-width as the content
    columnCells = slItems.map(item => {
      const richContent = item.querySelector('.cm.cm-rich-text.module__content');
      return richContent ? richContent : item;
    });
  }

  // Only replace if we have extracted columns
  if (columnCells.length > 0) {
    const tableRows = [headerRow, columnCells];
    const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(blockTable);
  }
}
