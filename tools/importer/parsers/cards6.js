/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as shown in the example
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Find all card items within the element
  const cardItems = element.querySelectorAll('.product-key-rate-item');

  cardItems.forEach((item) => {
    // First cell: image or icon (reference existing element if present)
    const img = item.querySelector('img') || '';

    // Second cell: full text content including all children and text nodes
    const textCellContent = [];

    // Title: from .key-value-text span (if present)
    const keyValueText = item.querySelector('.key-value-text span');
    if (keyValueText && keyValueText.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = keyValueText.textContent.trim();
      textCellContent.push(strong);
    }

    // Description and CTAs: from .key-top-text, preserving all HTML structure
    const descContainer = item.querySelector('.key-top-text');
    if (descContainer) {
      // Include all child nodes, preserving structure (e.g., <p>, <a>, <sup>, etc.)
      Array.from(descContainer.childNodes).forEach((node) => {
        // If it's a text node and not just whitespace, wrap in <p>
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textCellContent.push(p);
          }
        } else {
          textCellContent.push(node);
        }
      });
    }

    // Add the card row if there is at least one cell with content
    if (img || textCellContent.length) {
      rows.push([img, textCellContent]);
    }
  });

  // Create and replace with the new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
