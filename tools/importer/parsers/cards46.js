/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match EXACTLY
  const headerRow = ['Cards (cards46)'];

  // Find the cards container
  const cardsContainer = element.querySelector('.product-key-rates');
  if (!cardsContainer) return;

  // Get all card items
  const cardItems = Array.from(cardsContainer.querySelectorAll('.product-key-rate-item'));

  // Build rows for each card
  const rows = cardItems.map(item => {
    // Image (first cell)
    const img = item.querySelector('img');

    // Second cell: Compose from title and description, referencing existing elements
    // Title: from .key-value-text span
    const titleSpan = item.querySelector('.key-value-text span');
    // Description (may contain <b>, <a>, <br>): from .key-top-text
    const descDiv = item.querySelector('.key-top-text');

    // Build a container for text content
    const textCell = document.createElement('div');
    if (titleSpan && titleSpan.textContent.trim()) {
      // Use <div> for title, reference text
      const titleDiv = document.createElement('div');
      titleDiv.textContent = titleSpan.textContent;
      titleDiv.style.fontWeight = 'bold';
      titleDiv.style.color = '#D60A38';
      titleDiv.style.fontSize = '1.2em';
      textCell.appendChild(titleDiv);
    }
    if (descDiv && descDiv.innerHTML.trim()) {
      // Use original element for description
      textCell.appendChild(descDiv);
    }
    return [img, textCell];
  });

  // Compose the table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
