/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example: exactly one cell with exact block name
  const headerRow = ['Hero (hero15)'];

  // --------- Background Image Row ---------
  let imageElem = null;
  // Find background image from .intrinsic-el.img
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const urlMatch = bgDiv.style.backgroundImage.match(/url\(([^)]+)\)/);
    if (urlMatch && urlMatch[1]) {
      const src = urlMatch[1].replace(/['"]/g, '');
      imageElem = document.createElement('img');
      imageElem.src = src;
      // Use .vh span text for alt, if present
      const altSpan = bgDiv.querySelector('.vh');
      imageElem.alt = altSpan ? altSpan.textContent.trim() : '';
    }
  }
  const imageRow = [imageElem || ''];

  // --------- Content Row ---------
  // Gather all content in the same order as source, preserving headings, subheadings, etc.
  let contentArr = [];
  const anchor = element.querySelector('a');
  const contentDiv = anchor ? anchor.querySelector('.content') : null;
  if (contentDiv) {
    // Iterate over all direct children to preserve order and content
    Array.from(contentDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Replace CTA span with anchor, using original href
        if (node.classList && node.classList.contains('cta') && anchor && anchor.href) {
          const ctaLink = document.createElement('a');
          ctaLink.href = anchor.href;
          ctaLink.textContent = node.textContent;
          ctaLink.className = 'cta';
          contentArr.push(ctaLink);
        } else {
          // Reference the existing element for headings, subheadings, paragraphs
          contentArr.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent.trim();
        if (txt) contentArr.push(document.createTextNode(txt));
      }
    });
  }
  // Always provide at least an empty string if nothing is found
  const contentRow = [contentArr.length > 0 ? contentArr : ''];

  // --------- Create and replace block table ---------
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
