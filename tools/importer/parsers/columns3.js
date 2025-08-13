/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create header row: block name exactly as in example
  const headerRow = ['Columns (columns3)'];

  // 2. Get both columns from the HTML structure
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // 3. Column 1: image
  // Prefer the <figure> (full image block)
  let imgCol = null;
  const figure = slItems[0].querySelector('figure');
  if (figure) {
    imgCol = figure;
  } else {
    // fallback: use the whole sl-item
    imgCol = slItems[0];
  }

  // 4. Column 2: rich text content
  // Find the main content container
  let textCol = slItems[1].querySelector('.cm-rich-text, .module__content');
  if (!textCol) {
    // fallback: use the whole sl-item
    textCol = slItems[1];
  }

  // 5. Compose the table
  const cells = [
    headerRow,
    [imgCol, textCol]
  ];

  // 6. Replace the original element with the new block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
