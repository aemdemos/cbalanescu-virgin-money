/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main columns container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all direct .sl-item children (should be two for this layout)
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length !== 2) return;

  // For the left column: reference the full image section as a single cell
  const leftSection = slItems[0].querySelector(':scope > section, :scope > figure, :scope > div') || slItems[0];

  // For the right column: reference the full rich text container as a single cell
  const rightContent = slItems[1].querySelector('.cm-rich-text') || slItems[1];

  // Table cells: header and 1 row with 2 columns
  const cells = [
    ['Columns (columns3)'],
    [leftSection, rightContent]
  ];

  // Build table block and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
