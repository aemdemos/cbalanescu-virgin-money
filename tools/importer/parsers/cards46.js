/* global WebImporter */
export default function parse(element, { document }) {
  // Block header, matches example
  const headerRow = ['Cards (cards46)'];

  // Find the cards container
  const cardsContainer = element.querySelector('.product-key-rates');
  if (!cardsContainer) return;

  // Find all card items
  const cardElements = Array.from(cardsContainer.querySelectorAll('.product-key-rate-item'));

  const rows = cardElements.map(card => {
    // First cell: the image (mandatory)
    const img = card.querySelector('img');
    // If no image, use null so cell is empty

    // Second cell: text content (mandatory)
    const textContent = [];

    // Title (if present)
    const keyValue = card.querySelector('.key-value-text span');
    if (keyValue && keyValue.textContent.trim()) {
      // Use <strong> for title, retain color from source
      keyValue.style.fontWeight = 'bold';
      keyValue.style.color = '#e50040';
      textContent.push(keyValue);
    }

    // Description (if present)
    const keyTopText = card.querySelector('.key-top-text');
    if (keyTopText) {
      // Use existing element, don't clone
      textContent.push(keyTopText);
    }

    return [img, textContent];
  });

  // Build cells array
  const cells = [headerRow, ...rows];

  // Create and replace with table block
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
