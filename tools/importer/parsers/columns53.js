/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell
  const headerRow = ['Columns (columns53)'];

  // Get all top-level columns (.sl-item)
  const mainSlList = element.querySelector(':scope > div.sl > div.sl-list');
  if (!mainSlList) {
    // If there's no content, replace with a minimal block
    const emptyBlock = WebImporter.DOMUtils.createTable([headerRow, ['']], document);
    element.replaceWith(emptyBlock);
    return;
  }

  // Each .sl-item under mainSlList is a column
  const columnItems = Array.from(mainSlList.children).filter(
    (child) => child.classList && child.classList.contains('sl-item')
  );

  // Extract the images for each column
  function extractImages(columnEl) {
    const images = [];
    const colList = columnEl.querySelector(':scope > div.column-container > div.sl > div.sl-list');
    if (!colList) return images;
    const logoItems = Array.from(colList.children).filter(
      (child) => child.classList && child.classList.contains('sl-item')
    );
    logoItems.forEach(item => {
      const img = item.querySelector('img');
      if (img) images.push(img);
    });
    return images;
  }

  // Build the row with one cell per column
  const columnCells = columnItems.map(colEl => {
    const imgs = extractImages(colEl);
    return imgs.length ? imgs : [''];
  });

  // Compose the table: single header cell, then one row with all columns
  const cells = [
    headerRow,
    columnCells
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
