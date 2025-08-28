/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must match example)
  const headerRow = ['Hero (hero22)'];

  // Get background image (if present)
  let imageEl = null;
  const intrinsicEl = element.querySelector('.intrinsic-el');
  if (intrinsicEl && intrinsicEl.style && intrinsicEl.style.backgroundImage) {
    const bg = intrinsicEl.style.backgroundImage;
    const match = bg.match(/^url\(["']?(.*?)["']?\)$/);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1];
      imageEl = img;
    }
  }
  // Second row: Either background image (img), or fallback to the .intrinsic-el if no image found
  let imageCell = imageEl || intrinsicEl;

  // Also, capture any text in a .vh span (for accessibility/semantics)
  let vhTextNode = '';
  const vh = element.querySelector('.vh');
  if (vh && vh.textContent.trim()) {
    // Use a paragraph for extracted text
    const p = document.createElement('p');
    p.textContent = vh.textContent.trim();
    vhTextNode = p;
  }
  // Compose cell content
  let imageRowCell;
  if (imageCell && vhTextNode) {
    imageRowCell = [imageCell, vhTextNode];
  } else if (imageCell) {
    imageRowCell = imageCell;
  } else if (vhTextNode) {
    imageRowCell = vhTextNode;
  } else {
    imageRowCell = '';
  }

  // Third row: For this HTML, there is no additional text content block
  const textCell = '';

  // Create the table
  const cells = [
    headerRow,
    [imageRowCell],
    [textCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
