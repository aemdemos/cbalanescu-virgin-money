/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Columns (columns37)'];

  // Get the column content blocks
  // HTML structure:
  // div.column-container > div.sl > div.sl-list > div.sl-item (heading)
  //                                    > div.sl-item (links)
  const slList = element.querySelector('.sl-list');
  let leftCol = null;
  let rightCol = null;

  if (slList) {
    const slItems = slList.querySelectorAll(':scope > .sl-item');
    // Defensive: check for the two items
    if (slItems.length >= 2) {
      // First column: heading (rich text)
      leftCol = slItems[0].querySelector('.cm-rich-text') || slItems[0];
      // Second column: links (section)
      rightCol = slItems[1].querySelector('section') || slItems[1];
    } else {
      // Fallback: treat the whole element as one cell
      leftCol = element;
      rightCol = document.createElement('div');
    }
  } else {
    // Fallback: treat the whole element as one cell
    leftCol = element;
    rightCol = document.createElement('div');
  }

  // Construct the rows with references to real elements
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
