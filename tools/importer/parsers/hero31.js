/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly from the example
  const headerRow = ['Hero (hero31)'];

  // Extract background image as <img>, with alt text if available
  let bgImgEl = '';
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv && bgDiv.style.backgroundImage) {
    const urlMatch = bgDiv.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
    if (urlMatch && urlMatch[2]) {
      const src = urlMatch[2];
      let alt = '';
      const altSpan = bgDiv.querySelector('span');
      if (altSpan) {
        alt = altSpan.textContent.trim();
      }
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt || '';
      bgImgEl = img;
    }
  }
  const imgRow = [bgImgEl ? bgImgEl : ''];

  // Gather all content from .content as-is, preserving all text and structure
  const contentDiv = element.querySelector('.content');
  let contentItems = [];
  if (contentDiv) {
    // For CTA span, convert to link with href from parent <a>. Others: include as-is.
    Array.from(contentDiv.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim()) {
          contentItems.push(document.createTextNode(node.textContent));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('cta')) {
          // Find nearest <a> ancestor (should be top-level a)
          let linkEl = element.querySelector('a');
          if (linkEl && linkEl.href) {
            const ctaLink = document.createElement('a');
            ctaLink.href = linkEl.href;
            ctaLink.textContent = node.textContent.trim();
            contentItems.push(ctaLink);
          } else {
            contentItems.push(node);
          }
        } else {
          contentItems.push(node);
        }
      }
    });
  }
  const contentRow = [contentItems.length ? contentItems : ''];

  // Compose final table structure
  const cells = [
    headerRow,
    imgRow,
    contentRow,
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
