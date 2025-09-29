/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list (columns container)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all .sl-item columns
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length < 2) return;

  // Left column: rich text heading (e.g., Quick links)
  let leftCell = null;
  const leftRich = slItems[0].querySelector('.cm-rich-text, .cm');
  if (leftRich) leftCell = leftRich;
  else leftCell = slItems[0];

  // Right column: links list
  let rightCell = null;
  const rightSection = slItems[1].querySelector('section.cm-links');
  if (rightSection) rightCell = rightSection;
  else rightCell = slItems[1];

  // Compose the table
  const headerRow = ['Columns (columns47)'];
  const contentRow = [leftCell, rightCell];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
