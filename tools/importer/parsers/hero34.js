/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image from style attribute
  function extractBackgroundImageUrl(bgDiv) {
    if (!bgDiv) return null;
    const style = bgDiv.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
    if (match) {
      let url = match[1];
      // Make absolute if root-relative
      return url.startsWith('http') ? url : (url[0] === '/' ? url : '/' + url);
    }
    return null;
  }

  // Block header (must match example EXACTLY)
  const headerRow = ['Hero (hero34)'];

  // Background image row
  let bgImgEl = null;
  const bgDiv = element.querySelector('.intrinsic-el.img');
  const bgImgUrl = extractBackgroundImageUrl(bgDiv);
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    // Use visually hidden span text as alt if available
    const altSpan = bgDiv ? bgDiv.querySelector('.vh') : null;
    bgImgEl.alt = altSpan ? altSpan.textContent.trim() : '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // Content row: include ALL child nodes, maintain semantics, reference existing elements
  let contentRowContent = '';
  const contentDiv = element.querySelector('.content');
  if (contentDiv) {
    const blockContent = [];
    // Gather all block-level child nodes in order
    Array.from(contentDiv.childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        // Element nodes: Reference directly
        blockContent.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Text node (non-empty): Wrap in span to preserve
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        blockContent.push(span);
      }
    });
    // Add CTA as link (not as span), referencing container anchor
    const ctaSpan = contentDiv.querySelector('.cta');
    if (ctaSpan) {
      // Find ancestor anchor for link
      const ancestorLink = element.querySelector('a');
      if (ancestorLink && ancestorLink.href) {
        const a = document.createElement('a');
        a.href = ancestorLink.href;
        a.textContent = ctaSpan.textContent.trim();
        blockContent.push(a);
      }
    }
    contentRowContent = blockContent.length > 0 ? blockContent : '';
  }
  const contentRow = [contentRowContent];

  // Compose table
  const cells = [headerRow, bgRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with block table
  element.replaceWith(blockTable);
}
