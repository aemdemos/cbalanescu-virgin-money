/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Hero (hero2)'];

  // 2nd row: Background image extraction
  let imageEl = null;
  let altText = '';

  // Find the div with background-image
  const bgDiv = element.querySelector('.intrinsic-el');
  if (bgDiv && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
    if (match && match[2]) {
      imageEl = document.createElement('img');
      imageEl.src = match[2];
      // Use visually hidden span as alt if present
      const altSpan = bgDiv.querySelector('span.vh');
      if (altSpan) {
        altText = altSpan.textContent.trim();
        imageEl.alt = altText;
      }
    }
  }

  // 3rd row: Textual content
  // Gather all text nodes inside the block except for alt text
  // In this HTML, all text is in the visually hidden span
  // Preserve semantic meaning by outputting it in a paragraph, only if present
  let textContentCell = '';
  if (altText) {
    const p = document.createElement('p');
    p.textContent = altText;
    textContentCell = p;
  }

  const rows = [
    headerRow,            // Row 1: Header
    [imageEl ? imageEl : ''], // Row 2: Image or blank
    [textContentCell]     // Row 3: Text content or blank
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}