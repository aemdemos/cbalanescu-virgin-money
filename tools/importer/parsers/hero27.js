/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Hero (hero27)'];

  // --- Extract background image for 2nd row ---
  let imageElem = null;
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv?.style?.backgroundImage) {
    const urlMatch = bgDiv.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (urlMatch && urlMatch[1]) {
      const img = document.createElement('img');
      img.src = urlMatch[1];
      img.setAttribute('loading', 'lazy');
      imageElem = img;
    }
  }

  // --- Extract content for 3rd row ---
  const contentDiv = element.querySelector('.content');
  const contentParts = [];
  if (contentDiv) {
    // Title
    const header = contentDiv.querySelector('.header');
    if (header) {
      // The header might contain a <p><span> structure, preserve children
      Array.from(header.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          contentParts.push(node);
        }
      });
    }
    // Subtitle (may be empty and is not present in this HTML)
    const subtitle = contentDiv.querySelector('.subtitle');
    if (subtitle && subtitle.textContent.trim()) {
      contentParts.push(subtitle);
    }
    // Additional paragraphs that are not in the header
    Array.from(contentDiv.querySelectorAll('p')).forEach(p => {
      if (!header || !header.contains(p)) {
        contentParts.push(p);
      }
    });
  }

  // Arrange table rows
  const tableRows = [
    headerRow,
    [imageElem ? imageElem : ''],
    [contentParts]
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
