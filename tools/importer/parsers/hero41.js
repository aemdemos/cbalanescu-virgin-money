/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW: Use exact string ---
  const headerRow = ['Hero (hero41)'];

  // --- IMAGE ROW ---
  let imgElem = null;
  const imageDiv = element.querySelector('.image .intrinsic-el');
  if (imageDiv) {
    // Extract image URL from background-image style
    const style = imageDiv.getAttribute('style') || '';
    const urlMatch = style.match(/background-image:\s*url\((['"]?)([^'")]+)\1\)/);
    if (urlMatch) {
      const imgUrl = urlMatch[2];
      imgElem = document.createElement('img');
      imgElem.src = imgUrl;
      // Use alt text from <span> if present
      const altSpan = imageDiv.querySelector('span');
      imgElem.alt = altSpan && altSpan.textContent.trim() ? altSpan.textContent.trim() : '';
      imgElem.setAttribute('loading', 'lazy');
    }
  }
  const imageRow = [imgElem || ''];

  // --- CONTENT ROW ---
  // Get all direct children of .content (preserving order and structure)
  const contentDiv = element.querySelector('.content');
  let contentRow;
  if (contentDiv) {
    // Collect all non-empty elements and text nodes (preserving formatting)
    const parts = [];
    Array.from(contentDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Reference the actual element (preserves structure and formatting)
        parts.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Wrap text nodes in a <span> for block context
        const span = document.createElement('span');
        span.textContent = node.textContent;
        parts.push(span);
      }
    });
    contentRow = [parts.length ? parts : ''];
  } else {
    contentRow = [''];
  }

  // --- TABLE BUILD ---
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
