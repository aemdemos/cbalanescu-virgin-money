/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as required
  const headerRow = ['Hero (hero49)'];

  // 1. Extract background image (from style)
  let imageEl = null;
  const imgDiv = element.querySelector('.intrinsic-el.img');
  if (imgDiv) {
    const style = imgDiv.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]*)\)/);
    let imageUrl = '';
    if (match && match[1]) {
      imageUrl = match[1].trim();
      if (imageUrl.startsWith('/')) {
        imageUrl = 'https://www.virginmoney.com.au' + imageUrl;
      }
    }
    let imageAlt = '';
    const altSpan = imgDiv.querySelector('span.vh');
    if (altSpan) {
      imageAlt = altSpan.textContent.trim();
    }
    if (imageUrl) {
      imageEl = document.createElement('img');
      imageEl.src = imageUrl;
      imageEl.alt = imageAlt;
      imageEl.width = 750;
      imageEl.height = 415;
    }
  }

  // 2. Gather all content from .content block, preserving structure and ALL text
  // Reference existing elements as much as possible
  const contentDiv = element.querySelector('.content');
  let contentCell = [];
  if (contentDiv) {
    // For each child node, push as-is (reference, not clone) unless it's cta
    Array.from(contentDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Replace CTA span with link if needed
        if (node.classList.contains('cta')) {
          const link = element.querySelector('a');
          if (link) {
            const ctaLink = document.createElement('a');
            ctaLink.href = link.getAttribute('href');
            ctaLink.textContent = node.textContent.trim();
            contentCell.push(ctaLink);
          } else {
            contentCell.push(node); // fallback if no link found
          }
        } else {
          contentCell.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        contentCell.push(document.createTextNode(node.textContent));
      }
    });
  } else {
    // fallback: push entire element if .content is missing
    contentCell.push(element);
  }

  // Compose the block table exactly as specified
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
