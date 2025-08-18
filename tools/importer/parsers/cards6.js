/* global WebImporter */
export default function parse(element, { document }) {
  // Header row EXACTLY matching the block name
  const headerRow = ['Cards (cards6)'];
  const cards = [];

  // Select all immediate cards
  const cardItems = element.querySelectorAll('.product-key-rate-item');
  cardItems.forEach((card) => {
    // First column: Image/Icon
    const img = card.querySelector('img');

    // Second column: Textual content
    const content = [];
    // Title: .key-value-text > span, style as <strong>
    const keyValueText = card.querySelector('.key-value-text span');
    if (keyValueText && keyValueText.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = keyValueText.textContent.trim();
      content.push(strong);
    }

    // Description & CTA: .key-top-text
    const keyTopText = card.querySelector('.key-top-text');
    if (keyTopText) {
      // For robustness, include all children (text, <p>, <a>, <sup> etc)
      keyTopText.childNodes.forEach((node) => {
        // Only include non-empty text nodes
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          content.push(span);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // If <p> or <a> or <sup>, reference directly
          if (['P', 'A', 'SUP'].includes(node.tagName)) {
            content.push(node);
          } else {
            // For other elements, include if not empty
            if (node.textContent && node.textContent.trim()) {
              content.push(node);
            }
          }
        }
      });
    }
    // If no content was added, ensure at least the description container is used
    if (content.length === 0 && keyTopText) {
      content.push(keyTopText);
    }
    // Add card row to table: always two columns
    cards.push([img, content]);
  });

  // Construct cell array
  const cells = [headerRow, ...cards];
  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
