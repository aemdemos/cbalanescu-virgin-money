/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: clone node deeply and remove all class/style attributes
  function cleanClone(node) {
    const clone = node.cloneNode(true);
    clone.removeAttribute && clone.removeAttribute('class');
    clone.removeAttribute && clone.removeAttribute('style');
    Array.from(clone.querySelectorAll('[class], [style]')).forEach(el => {
      el.removeAttribute('class');
      el.removeAttribute('style');
    });
    return clone;
  }

  // 1. Header row
  const headerRow = ['Hero (hero4)'];

  // 2. Background image row
  let bgImgEl = '';
  const img = element.querySelector('img');
  if (img) {
    bgImgEl = img.cloneNode(true);
  }
  const bgImgRow = [bgImgEl];

  // 3. Content row
  const content = element.querySelector('.content');
  let contentParts = [];
  if (content) {
    // Gather all children in order, not just specific selectors
    Array.from(content.childNodes).forEach(node => {
      // Ignore empty text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      // For CTA span, convert to link if possible
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('cta')) {
        const a = element.querySelector('a');
        if (a && a.href) {
          const ctaLink = document.createElement('a');
          ctaLink.href = a.href;
          ctaLink.textContent = node.textContent;
          contentParts.push(ctaLink);
        } else {
          contentParts.push(cleanClone(node));
        }
      } else {
        contentParts.push(cleanClone(node));
      }
    });
  }
  const contentRow = [contentParts];

  // Build the table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
