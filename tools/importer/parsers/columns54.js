/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match example exactly
  const headerRow = ['Columns (columns54)'];

  // Find the column container (the main wrapper for the columns)
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the .sl-list which wraps the columns
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  // Columns are direct children .sl-item
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  // We expect exactly two columns per the HTML
  if (slItems.length < 2) return;

  // First column: image
  let firstColContent;
  // Find .cm-image inside first .sl-item
  const imgSection = slItems[0].querySelector('.cm-image');
  if (imgSection) {
    // Return the existing section (which contains the figure/img structure)
    firstColContent = imgSection;
  } else {
    // fallback: empty div
    firstColContent = document.createElement('div');
  }

  // Second column: text and app links
  let secondColContent;
  // Grab the .cm-rich-text inside second .sl-item
  const richTextSection = slItems[1].querySelector('.cm-rich-text');
  if (richTextSection) {
    secondColContent = richTextSection;
  } else {
    // fallback: empty div
    secondColContent = document.createElement('div');
  }

  // Structure as in the markdown example:
  //   Header row with one cell
  //   Second row with two columns: left and right
  const cells = [
    headerRow,
    [firstColContent, secondColContent],
  ];

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
