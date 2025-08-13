/* global WebImporter */
export default function parse(element, { document }) {
  // Table header from the spec
  const headerRow = ['Cards (cards6)'];
  const cells = [headerRow];

  // Grab all direct card items
  const cardItems = element.querySelectorAll('.product-key-rate-item');
  cardItems.forEach((item) => {
    // First cell is the image/icon (reference existing element)
    const img = item.querySelector('img');

    // Second cell is all text content, which may include title, description, CTA, and superscripts
    const textParts = [];

    // Title: from .key-value-text > span (preserve semantics; strong for heading)
    const keyValueText = item.querySelector('.key-value-text span');
    if (keyValueText && keyValueText.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = keyValueText.textContent.trim();
      textParts.push(strong);
    }

    // Description + CTA: in .key-top-text (may be plain text or contain <p> and <a>)
    const keyTopText = item.querySelector('.key-top-text');
    if (keyTopText) {
      // Push each <p> or text node separately
      Array.from(keyTopText.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Reference existing <p>, <a>, <sup>, etc.
          textParts.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textParts.push(span);
        }
      });
    }

    cells.push([
      img,
      textParts
    ]);
  });

  // Create the block table and replace original
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
