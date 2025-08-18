/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract background image URL from style attribute
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const urlMatch = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/i);
    return urlMatch && urlMatch[1] ? urlMatch[1] : null;
  }

  // Extract the background image as <img>
  let imgEl = null;
  const bgImgDiv = element.querySelector('.intrinsic-el.img');
  if (bgImgDiv) {
    const url = getBackgroundImageUrl(bgImgDiv.getAttribute('style'));
    if (url) {
      imgEl = document.createElement('img');
      imgEl.src = url.startsWith('http') ? url : `https://www.virginmoney.com${url}`;
      const vhSpan = bgImgDiv.querySelector('.vh');
      imgEl.alt = vhSpan ? vhSpan.textContent.trim() : '';
    }
  }

  // Extract all content from the .content block as a single cell, using references to child nodes
  let contentCell = '';
  const contentDiv = element.querySelector('.content');
  if (contentDiv) {
    // Use the actual child nodes as references (no cloning), to include all text and preserve formatting
    // Remove empty subtitle if present
    const nodes = [];
    Array.from(contentDiv.childNodes).forEach(node => {
      // Omit subtitle if it's empty
      if (node.classList && node.classList.contains('subtitle') && !node.textContent.trim()) return;
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        nodes.push(node);
      }
    });
    contentCell = nodes.length === 1 ? nodes[0] : nodes;
  }

  // Build the block table
  const cells = [
    ['Hero (hero41)'],
    [imgEl ? imgEl : ''],
    [contentCell]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
