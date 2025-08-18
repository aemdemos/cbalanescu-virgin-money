/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Must match exactly
  const headerRow = ['Hero (hero49)'];

  // 2. Second row: Background image if present
  let imageEl = null;
  const bgDiv = element.querySelector('.img');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const urlMatch = bgDiv.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
    if (urlMatch && urlMatch[2]) {
      imageEl = document.createElement('img');
      imageEl.src = urlMatch[2];
      imageEl.setAttribute('loading', 'lazy');
      const altSpan = bgDiv.querySelector('.vh');
      if (altSpan) {
        imageEl.alt = altSpan.textContent.trim();
      }
    }
  }
  const secondRow = [imageEl ? imageEl : ''];

  // 3. Third row: All text content, headings, CTA in one cell, referencing existing elements
  const contentDiv = element.querySelector('.content');
  let contentArr = [];
  if (contentDiv) {
    Array.from(contentDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // If CTA span, convert to link referencing parent <a>
        if (
          node.classList && node.classList.contains('cta') &&
          element.querySelector('a') && element.querySelector('a').href
        ) {
          const ctaLink = document.createElement('a');
          ctaLink.href = element.querySelector('a').href;
          ctaLink.textContent = node.textContent;
          ctaLink.className = 'cta';
          contentArr.push(ctaLink);
        } else {
          contentArr.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Preserve any meaningful raw text nodes
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        contentArr.push(span);
      }
    });
  }
  const thirdRow = [contentArr.length ? contentArr : ''];

  // 4. Compose table: only one table as in example
  const cells = [headerRow, secondRow, thirdRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
