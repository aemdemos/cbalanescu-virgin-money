/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell
  const headerRow = ['Columns (columns15)'];

  // Find the left image
  let leftImgSection = element.querySelector('.sl-list.has-feature-right > .sl-item .cm-image');
  let leftImgCell = null;
  if (leftImgSection) {
    leftImgCell = leftImgSection;
  } else {
    // fallback: first image
    const fallbackImg = element.querySelector('img');
    if (fallbackImg) leftImgCell = fallbackImg;
  }

  // Find the right columns' container
  let rightColumns = element.querySelector('.sl-list.has-2-items:not(.has-feature-right)');

  // Prepare two content columns according to visual grouping
  let colLeft = [];
  let colRight = [];
  if (rightColumns) {
    const colItems = rightColumns.querySelectorAll(':scope > .sl-item');
    // If we have two columns, split their .cm-icon-title children
    if (colItems.length === 2) {
      const leftIconTitles = colItems[0].querySelectorAll(':scope > .cm-icon-title');
      const rightIconTitles = colItems[1].querySelectorAll(':scope > .cm-icon-title');
      if (leftIconTitles.length) colLeft = Array.from(leftIconTitles);
      if (rightIconTitles.length) colRight = Array.from(rightIconTitles);
    }
  }

  // Compose the row for the columns block
  const rowCells = [
    leftImgCell || '',
    colLeft.length ? colLeft : '',
    colRight.length ? colRight : ''
  ];

  // The final cells array must have the first row as a single cell
  // and the second row as three columns for the content
  const cells = [headerRow, rowCells];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
