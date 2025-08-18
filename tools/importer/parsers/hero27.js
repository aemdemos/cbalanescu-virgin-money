/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from style
  function extractBgUrl(style) {
    const match = style && style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
    return match ? match[1] : null;
  }

  // Find the background image (if any)
  let imageEl = null;
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv && bgDiv.hasAttribute('style')) {
    const bgUrl = extractBgUrl(bgDiv.getAttribute('style'));
    if (bgUrl) {
      imageEl = document.createElement('img');
      imageEl.src = bgUrl;
      imageEl.alt = '';
    }
  }

  // Find the text content block
  const contentDiv = element.querySelector('.content');
  const contentNodes = [];
  if (contentDiv) {
    // h1: keep as heading
    const h1 = contentDiv.querySelector('h1');
    if (h1) contentNodes.push(h1);
    // subtitle (if not empty)
    const subtitle = contentDiv.querySelector('.subtitle');
    if (subtitle && subtitle.textContent.trim()) contentNodes.push(subtitle);
    // All other direct children (paragraphs, etc)
    Array.from(contentDiv.children).forEach((child) => {
      if (
        child !== h1 &&
        !(child.classList && child.classList.contains('subtitle'))
      ) {
        if (child.textContent.trim()) contentNodes.push(child);
      }
    });
  }

  // Compose table rows
  const rows = [
    ['Hero (hero27)'],
    [imageEl ? imageEl : ''],
    [contentNodes.length ? contentNodes : '']
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
