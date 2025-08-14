/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, single column
  const headerRow = ['Hero (hero41)'];

  // Row 2: Background image (as <img>, extracting url and alt from source)
  let imageCell = '';
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv && bgDiv.style.backgroundImage) {
    const bgUrlMatch = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (bgUrlMatch && bgUrlMatch[1]) {
      const img = document.createElement('img');
      img.src = bgUrlMatch[1];
      const altSpan = bgDiv.querySelector('span.vh');
      if (altSpan) {
        img.alt = altSpan.textContent.trim();
      }
      imageCell = img;
    }
  }

  // Row 3: Structured content below image (include all text/element children in order)
  const contentDiv = element.querySelector('.content');
  let contentCell = '';
  if (contentDiv) {
    const parts = [];
    Array.from(contentDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Only include elements with non-empty text
        if (node.textContent && node.textContent.trim()) {
          parts.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // For raw text (shouldn't occur here, but safety)
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        parts.push(p);
      }
    });
    if (parts.length) {
      contentCell = parts;
    }
  }

  // Compose table structure as per block guideline
  const cells = [
    headerRow,
    [imageCell],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
