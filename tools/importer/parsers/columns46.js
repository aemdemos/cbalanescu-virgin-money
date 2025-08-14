/* global WebImporter */
export default function parse(element, { document }) {
  // Find the rates block
  const rates = element.querySelector('.cc01-rates .product-key-rates');
  if (!rates) return;

  // Get all immediate children that represent columns
  const columnItems = Array.from(rates.children).filter(
    (el) => el.classList.contains('product-key-rate-item')
  );

  // Each column: preserve content and semantic structure
  const columns = columnItems.map((item) => {
    // We'll keep image, heading, and all text
    // Compose a wrapper div for the column
    const colDiv = document.createElement('div');
    // Find the image (should be present)
    const img = item.querySelector('img');
    if (img) colDiv.appendChild(img);
    // Find the main heading text (usually in .key-value-text > span)
    const keyValue = item.querySelector('.key-value-text');
    if (keyValue) {
      const heading = document.createElement('div');
      heading.style.fontWeight = 'bold';
      heading.style.color = '#c4001d';
      heading.style.fontSize = '1.125em';
      heading.append(...keyValue.childNodes);
      colDiv.appendChild(heading);
    }
    // Find the main detail text (in .key-top-text)
    const keyTop = item.querySelector('.key-top-text');
    if (keyTop) {
      // Move all children (preserving <b>, <a>, <br>, etc)
      const detail = document.createElement('div');
      while (keyTop.firstChild) {
        detail.appendChild(keyTop.firstChild);
      }
      colDiv.appendChild(detail);
    }
    return colDiv;
  });

  // Table construction: header row matches example
  const cells = [
    ['Columns (columns46)'],
    columns,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
