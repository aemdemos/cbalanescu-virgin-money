/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate .sl-list blocks - two top-level columns
  const slLists = Array.from(element.querySelectorAll(':scope > div > div.sl > div.sl-list'));

  // Defensive: Only continue if there are exactly 2 columns/sl-lists (per screenshot)
  if (slLists.length !== 2) return;

  // Each .sl-list contains 4 .sl-item image logos
  // Compose row: 8 columns, one logo per column, in order
  const allLogos = [];
  slLists.forEach(slList => {
    const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
    slItems.forEach(slItem => {
      const img = slItem.querySelector('img');
      if (img) {
        allLogos.push(img);
      }
    });
  });

  // Edge case: If not exactly 8 logos, do not replace (per screenshot)
  if (allLogos.length !== 8) return;

  // Block Table Construction
  // 1. Header row
  const headerRow = ['Columns (columns53)'];
  // 2. Logos row - each logo as a column
  const logosRow = allLogos;

  // Build table
  const cells = [headerRow, logosRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(blockTable);
}
