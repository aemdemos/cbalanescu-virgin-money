/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per instructions
  const headerRow = ['Hero (hero9)'];

  // --- Background Image Extraction ---
  let bgImgCell = '';
  // Find the element containing the background-image style.
  // Accept both with and without absolute URLs
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    const style = bgDiv.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (match && match[1]) {
      let src = match[1];
      // If not absolute, prepend domain
      if (!/^https?:/.test(src)) {
        src = `https://www.virginmoney.com${src}`;
      }
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      bgImgCell = img;
    }
  }

  // --- Content Extraction ---
  // Reference the main content container
  const contentDiv = element.querySelector('.content');
  let contentCell = '';
  if (contentDiv) {
    // To ensure resiliency and preserve formatting, reference the whole div
    contentCell = contentDiv;
  }

  // --- Table Construction ---
  // Always 1 column, 3 rows
  const cells = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
