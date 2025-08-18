/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as required
  const headerRow = ['Hero (hero21)'];

  // Row 2: Background Image (preserve original block as much as possible)
  let imageCellContent = null;
  const bgDiv = element.querySelector('.intrinsic-el.img');
  let imageUrl = '';
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/i);
    if (match && match[1]) {
      imageUrl = match[1].trim();
    }
  }
  if (imageUrl) {
    // Create image element if available
    const img = document.createElement('img');
    img.src = imageUrl;
    imageCellContent = img;
  } else {
    // If no image, append the existing bgDiv (which may have text content for accessibility)
    if (bgDiv) {
      imageCellContent = bgDiv;
    } else {
      imageCellContent = document.createTextNode('');
    }
  }

  // Row 3: All non-image text content (flattened)
  // We'll collect all text content not coming from background image areas
  // In this HTML, there's no actual visible text, but for flexibility we'll grab anything
  function getAllVisibleText(el) {
    let result = [];
    for (let node of el.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // skip the image area
        if (!node.classList.contains('image')) {
          result.push(getAllVisibleText(node));
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim()) {
          result.push(node.textContent);
        }
      }
    }
    return result.flat();
  }
  const textBits = getAllVisibleText(element).join(' ').trim();
  const contentRow = [textBits];

  // Compose table
  const cells = [headerRow, [imageCellContent], contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
