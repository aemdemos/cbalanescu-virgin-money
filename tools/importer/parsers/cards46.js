/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table rows
  const rows = [['Cards (cards46)']];

  // Find all card items
  const ratesBlock = element.querySelector('.cc01-rates');
  const cardsContainer = ratesBlock && ratesBlock.querySelector('.product-key-rates');
  if (!cardsContainer) return;

  const cardItems = cardsContainer.querySelectorAll(':scope > .product-key-rate-item');

  cardItems.forEach((item) => {
    // First cell: image/icon, reference the actual img element
    const img = item.querySelector('img');
    // Second cell: text content
    // Title (span inside .key-value-text, use strong tag for semantic meaning)
    const titleSpan = item.querySelector('.key-value-text span');
    let titleElem = null;
    if (titleSpan && titleSpan.textContent.trim()) {
      // Use <strong> for emphasis in cards, no color styling
      titleElem = document.createElement('strong');
      titleElem.textContent = titleSpan.textContent.trim();
    }
    // Description: .key-top-text, reference entire block for robustness
    const desc = item.querySelector('.key-top-text');
    // Compose second cell
    const cellContent = [];
    if (titleElem) {
      cellContent.push(titleElem);
      // Add space or line break if desc exists
      if (desc) cellContent.push(document.createElement('br'));
    }
    if (desc) {
      cellContent.push(desc);
    }
    rows.push([img, cellContent]);
  });
  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
