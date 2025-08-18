/* global WebImporter */
export default function parse(element, { document }) {
  // Table Header
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Get all cards (each .product-key-rate-item is a card)
  const cardItems = element.querySelectorAll('.product-key-rate-item');
  cardItems.forEach((card) => {
    // First column: image/icon
    const img = card.querySelector('img');
    // Second column: text content
    const textFragments = [];

    // Title (can include whitespace): .key-value-text span
    const titleSpan = card.querySelector('.key-value-text span');
    if (titleSpan && titleSpan.textContent.trim()) {
      const title = document.createElement('strong');
      title.textContent = titleSpan.textContent.trim();
      textFragments.push(title);
    }

    // Description & CTA: .key-top-text (may contain <p>, <a>, etc.)
    const desc = card.querySelector('.key-top-text');
    if (desc) {
      // For cards where description is just text, preserve as text
      // For cards where description includes links or <p>, preserve all HTML structure
      Array.from(desc.childNodes).forEach((node) => {
        // Skip whitespace-only text nodes between blocks
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return;
        // Otherwise, keep the node as is
        textFragments.push(node);
      });
    }
    
    // Compose the row
    rows.push([
      img,
      textFragments.length === 1 ? textFragments[0] : textFragments
    ]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
