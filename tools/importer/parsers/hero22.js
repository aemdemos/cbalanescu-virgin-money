/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Hero (hero22)'];

  // Extract background image
  const imgEl = element.querySelector('img');
  const backgroundRow = imgEl ? [imgEl] : [''];

  // Extract text content (from .vh span or any visible text)
  let content = '';
  // Try .vh span first
  const vhSpan = element.querySelector('.vh');
  if (vhSpan && vhSpan.textContent.trim()) {
    content = vhSpan.textContent.trim();
  } else {
    // Fallback: any text node inside the element
    const textNodes = Array.from(element.querySelectorAll('*'))
      .map(el => el.textContent.trim())
      .filter(Boolean);
    if (textNodes.length > 0) {
      content = textNodes.join(' ');
    }
  }
  const contentRow = [content];

  // Always output 3 rows per block spec
  const cells = [headerRow, backgroundRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
