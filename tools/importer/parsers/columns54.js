/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns54)'];

  // Get the top-level rows: .column-container > .sl > .sl-list > .sl-item
  const sl = element.querySelector(':scope > .sl');
  if (!sl) return;
  const slList = sl.querySelector(':scope > .sl-list');
  if (!slList) return;
  // Each .sl-item is a row, representing a logical grouping
  const slRows = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));

  // For each row, collect all images as a logical grouping (array)
  const tableRows = slRows.map(rowEl => {
    // Find images in: .column-container > .sl > .sl-list > .sl-item > section > figure > div > img
    const nestedImgs = Array.from(rowEl.querySelectorAll('img'));
    // If there are no images, put empty string as cell
    return [nestedImgs.length ? nestedImgs : ''];
  });

  // Final table: header row, then rows of (grouped images)
  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
