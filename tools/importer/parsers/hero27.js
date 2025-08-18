/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must match example exactly)
  const headerRow = ['Hero (hero27)'];

  // --- Background Image Row ---
  let bgImgEl = null;
  const bgDiv = element.querySelector('.img[style*="background-image"]');
  if (bgDiv) {
    const style = bgDiv.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^\)]+)\)/);
    if (match && match[1]) {
      let src = match[1].trim().replace(/^['"]|['"]$/g, '');
      if (src.startsWith('/')) {
        src = 'https://www.virginmoney.com' + src;
      }
      bgImgEl = document.createElement('img');
      bgImgEl.src = src;
      bgImgEl.alt = '';
    }
  }
  const imageRow = [bgImgEl ? bgImgEl : ''];

  // --- Content Row ---
  // Reference the .content div directly to ensure all text and semantic elements are included
  const contentDiv = element.querySelector('.content');
  const contentRow = [contentDiv ? contentDiv : ''];

  // --- Build block table ---
  const rows = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
