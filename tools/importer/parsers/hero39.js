/* global WebImporter */
export default function parse(element, { document }) {
  // TABLE HEADER
  const cells = [['Hero (hero39)']];

  // IMAGE ROW: Extract background image as <img>
  let imgCell = [''];
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    const style = bgDiv.getAttribute('style') || '';
    const match = style.match(/background-image:url\(([^)]+)\)/);
    if (match) {
      let url = match[1].replace(/^['"]|['"]$/g, '');
      if (url.startsWith('/')) {
        url = 'https://uk.virginmoney.com' + url;
      }
      // Alt text from span (if exists)
      let alt = '';
      const altSpan = bgDiv.querySelector('span');
      if (altSpan) alt = altSpan.textContent.trim();
      const img = document.createElement('img');
      img.src = url;
      img.alt = alt;
      img.width = 750;
      img.height = 415;
      imgCell = [img];
    }
  }
  cells.push([imgCell]);

  // CONTENT ROW: Gather all text-related content referencing original nodes
  const contentDiv = element.querySelector('.content');
  let contentEls = [];
  if (contentDiv) {
    // Include all direct children, keeping structure/formatting
    Array.from(contentDiv.childNodes).forEach(node => {
      if (node.nodeType === 1) {
        // If element, reference as-is
        contentEls.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Text node, wrap in <span>
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        contentEls.push(span);
      }
    });
    // If contentDiv is empty but non-empty text
    if (contentEls.length === 0 && contentDiv.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = contentDiv.textContent.trim();
      contentEls.push(span);
    }
  }
  // Fallback
  if (contentEls.length === 0) contentEls = [''];
  cells.push([contentEls]);

  // CREATE TABLE AND REPLACE
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
