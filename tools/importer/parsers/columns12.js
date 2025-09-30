/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct .product-key-rate-item children
  const items = Array.from(element.querySelectorAll('.product-key-rate-item'));
  if (!items.length) return;

  // Compose each column cell
  const columns = items.map((item) => {
    const cellContent = [];
    // Reference the image element (do not clone)
    const img = item.querySelector('img');
    if (img) cellContent.push(img);

    // Title: from .key-value-text > span, use <h3> for semantic meaning
    const titleSpan = item.querySelector('.key-value-text span');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      cellContent.push(h3);
    }

    // Description: from .key-top-text (may contain <p>, <b>, <a>, <br>, etc.)
    const desc = item.querySelector('.key-top-text');
    if (desc) cellContent.push(desc);

    return cellContent;
  });

  // Compose table rows
  const headerRow = ['Columns (columns12)'];
  const contentRow = columns;
  const rows = [headerRow, contentRow];

  // Create table using DOMUtils
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
