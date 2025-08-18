/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per example markdown
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Helper to build the text block for each card
  function buildTextCell(main, secondary) {
    const cell = document.createElement('div');
    // Title (h2)
    const title = main.querySelector('h2');
    if (title) cell.appendChild(title);

    // Key rates (numbers + labels)
    const keyRates = main.querySelector('.product-key-rates');
    if (keyRates) {
      Array.from(keyRates.children).forEach(item => {
        const value = item.querySelector('.key-value-text');
        const bottom = item.querySelector('.key-bottom-text');
        if (value) cell.appendChild(value);
        if (bottom) cell.appendChild(bottom);
      });
    }
    // Extra description (rarely used)
    const keyDesc = main.querySelector('.product-key-description');
    if (keyDesc && keyDesc.textContent.trim()) cell.appendChild(keyDesc);

    if (secondary) {
      // Main product description
      const prodDesc = secondary.querySelector('.product-description');
      if (prodDesc) cell.appendChild(prodDesc);
      // Features (ul, except .product-features which are always empty here)
      Array.from(secondary.querySelectorAll('ul')).forEach(ul => {
        if (!ul.classList.contains('product-features') && ul.children.length) cell.appendChild(ul);
      });
      // CTA links
      const ctas = Array.from(secondary.querySelectorAll('a'));
      if (ctas.length) {
        const p = document.createElement('p');
        ctas.forEach(a => p.appendChild(a));
        cell.appendChild(p);
      }
    }
    return cell;
  }

  // Find all .tab panels (these include products for both offers)
  const tabs = element.querySelectorAll('.tabs > .tab');
  tabs.forEach(tab => {
    const tiles = tab.querySelectorAll('.cm-product-tile');
    tiles.forEach(tile => {
      const img = tile.querySelector('.image img'); // reference the actual <img> element
      const main = tile.querySelector('.content-main');
      const secondary = tile.querySelector('.content-secondary');
      // Only add if we have an image and text
      if (img && main && secondary) {
        rows.push([img, buildTextCell(main, secondary)]);
      }
    });
  });

  // Replace the source element with the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
