/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image url from a style background-image
  function extractImageUrl(el) {
    if (!el) return null;
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      return match[1].replace(/^['"]|['"]$/g, '');
    }
    return null;
  }

  // Header row (block name must match example exactly)
  const headerRow = ['Hero (hero49)'];

  // Image row: extract image from background-image, include alt text from span
  let imageEl = null;
  const bgImageDiv = element.querySelector('.img');
  const imageUrl = extractImageUrl(bgImageDiv);
  let altText = '';
  if (bgImageDiv) {
    const altSpan = bgImageDiv.querySelector('span');
    if (altSpan) altText = altSpan.textContent.trim();
  }
  if (imageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imageUrl;
    imageEl.alt = altText;
    imageEl.setAttribute('loading', 'eager');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // Content row: extract all content, preserving semantics and all text
  // The content is inside .content within an <a>
  let contentDiv = null;
  const mainLink = element.querySelector('a');
  if (mainLink) {
    contentDiv = mainLink.querySelector('.content');
  }
  if (!contentDiv) {
    contentDiv = element.querySelector('.content');
  }

  // Reference all direct children of contentDiv (preserving order & types)
  let contentItems = [];
  if (contentDiv) {
    contentItems = Array.from(contentDiv.childNodes)
      .map((node) => {
        // Replace CTA span with <a> if needed
        if (
          node.nodeType === 1 &&
          node.classList.contains('cta') &&
          mainLink &&
          mainLink.getAttribute('href')
        ) {
          const ctaLink = document.createElement('a');
          ctaLink.href = mainLink.getAttribute('href');
          ctaLink.textContent = node.textContent.trim();
          ctaLink.className = 'cta-link';
          return ctaLink;
        }
        // Preserve element nodes and non-empty text nodes
        if (node.nodeType === 1) {
          return node;
        }
        if (node.nodeType === 3 && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          return span;
        }
        return null;
      })
      .filter(Boolean);
  }
  const contentRow = [contentItems.length ? contentItems : ''];

  // Compose table with 1 column and 3 rows (header, image, content)
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
