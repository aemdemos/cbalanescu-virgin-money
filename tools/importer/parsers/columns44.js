/* global WebImporter */
export default function parse(element, { document }) {
  // Get the column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Get the sl-list which contains the columns
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  // Get the sl-items (columns)
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length < 2) return;

  // First column: find the image figure or section
  let firstColContent = slItems[0].querySelector('section, figure, img, div');
  if (!firstColContent) firstColContent = slItems[0]; // fallback to entire node

  // Second column: find the rich text block
  let secondColContent = slItems[1].querySelector('.cm-rich-text, section, div');
  if (!secondColContent) secondColContent = slItems[1]; // fallback

  // Table header must match exactly
  const headerRow = ['Columns (columns44)'];
  const cells = [headerRow, [firstColContent, secondColContent]];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the source element
  element.replaceWith(block);
}
