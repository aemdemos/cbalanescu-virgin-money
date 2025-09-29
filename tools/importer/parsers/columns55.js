/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all images from a column (sl-list > sl-item)
  function extractColumnImages(colContainer) {
    const imgs = [];
    // Find all images inside this column container
    colContainer.querySelectorAll('img').forEach((img) => {
      imgs.push(img);
    });
    return imgs;
  }

  // Find the top-level columns (should be 2)
  const slList = element.querySelector(':scope > .sl > .sl-list');
  if (!slList) return;
  const topLevelColumns = Array.from(slList.children).filter((child) => child.classList.contains('sl-item'));
  if (topLevelColumns.length < 2) return;

  // For each column, extract all images in order
  const columns = topLevelColumns.map((col) => {
    const innerColContainer = col.querySelector('.column-container');
    if (!innerColContainer) return [];
    return extractColumnImages(innerColContainer);
  });

  // Defensive: ensure both columns are arrays
  const col1Imgs = Array.isArray(columns[0]) ? columns[0] : [];
  const col2Imgs = Array.isArray(columns[1]) ? columns[1] : [];

  // The block header row
  const headerRow = ['Columns (columns55)'];

  // The block content row: each cell is a column (array of images)
  const contentRow = [col1Imgs, col2Imgs];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
