/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell with the exact text
  const headerRow = ['Columns (columns29)'];

  // Find columns content in HTML
  const slList = element.querySelector('.sl-list');
  let columnItems = [];
  if (slList) {
    columnItems = Array.from(slList.children);
  }

  // Prepare the columns (second row)
  const columns = [];

  // First column: all rich text blocks from the first .sl-item
  if (columnItems.length > 0) {
    const firstColItem = columnItems[0];
    // Find all immediate .cm.cm-rich-text children
    const richTextBlocks = Array.from(firstColItem.querySelectorAll('.cm.cm-rich-text'));
    columns.push(richTextBlocks);
  } else {
    columns.push(document.createTextNode(''));
  }

  // Second column: image from second .sl-item
  if (columnItems.length > 1) {
    const secondColItem = columnItems[1];
    // Find the first <img> inside
    const img = secondColItem.querySelector('img');
    columns.push(img ? img : document.createTextNode(''));
  } else {
    columns.push(document.createTextNode(''));
  }

  // Compose table as per requirements: header is a single cell, next row contains two cells
  const cells = [headerRow, columns];

  // Create the block and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
