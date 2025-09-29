/* global WebImporter */
export default function parse(element, { document }) {
  // Find the sl-list containing the columns
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Find all direct .sl-item children (columns)
  const columnItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  if (columnItems.length !== 2) return;

  // First column: image
  let leftContent;
  const leftImg = columnItems[0].querySelector('img');
  if (leftImg) {
    leftContent = leftImg;
  } else {
    leftContent = columnItems[0]; // fallback: reference the column
  }

  // Second column: rich text
  let rightContent;
  const richText = columnItems[1].querySelector('.cm-rich-text');
  if (richText) {
    rightContent = richText;
  } else {
    rightContent = columnItems[1]; // fallback: reference the column
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns44)'];
  const columnsRow = [leftContent, rightContent];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([headerRow, columnsRow], document);

  // Replace element
  element.replaceWith(table);
}
