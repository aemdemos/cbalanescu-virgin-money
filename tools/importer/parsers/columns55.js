/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row, exactly as required
  const headerRow = ['Columns (columns55)'];

  // 2. Find the two main columns: there are two .sl-item blocks (each with four logos)
  // The input element is a .column-container, holding a .sl > .sl-list > [sl-item, sl-item]
  // Each sl-item contains another .column-container with four logos
  // We'll grab both columns, each as an array of four <img> elements.

  // Get both main .sl-item columns
  const topSlList = element.querySelector(':scope > div > div.sl > div.sl-list');
  const slItems = topSlList ? Array.from(topSlList.children).filter(c => c.classList.contains('sl-item')) : [];

  // Defensive: if not found, fallback to all descendant img
  if (slItems.length === 0) {
    const allImgs = Array.from(element.querySelectorAll('img'));
    const cells = [headerRow, allImgs];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  // For each sl-item (should be two), get the 4 logos as <img> elements
  const columns = slItems.map(slItem => {
    // Each slItem contains a column-container > sl > sl-list > (four sl-item)
    const colContainer = slItem.querySelector(':scope > div.column-container > div.sl > div.sl-list');
    if (!colContainer) return [];
    // Each child of colContainer is a logo sl-item with an <img>
    const logoItems = Array.from(colContainer.children).filter(c => c.classList.contains('sl-item'));
    const imgs = logoItems.map(logoItem => {
      const img = logoItem.querySelector('img');
      return img;
    }).filter(Boolean);
    return imgs;
  });

  // We want a table with a header, then a single row of two columns, each containing its four <img> elements.
  // Defensive: if columns is empty, fallback to all imgs in one row
  let table;
  if (columns.length >= 2) {
    const cells = [headerRow, columns];
    table = WebImporter.DOMUtils.createTable(cells, document);
  } else {
    // fallback, put all images in one cell
    const allImgs = Array.from(element.querySelectorAll('img'));
    const cells = [headerRow, [allImgs]];
    table = WebImporter.DOMUtils.createTable(cells, document);
  }

  // Replace the original element with the table
  element.replaceWith(table);
}
