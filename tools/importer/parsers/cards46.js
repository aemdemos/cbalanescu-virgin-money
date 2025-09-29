/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards46)'];

  // Defensive: find the container holding the cards
  const rates = element.querySelector('.cc01-rates');
  if (!rates) return;
  const itemsContainer = rates.querySelector('.product-key-rates');
  if (!itemsContainer) return;

  // Get all card items
  const cardItems = Array.from(itemsContainer.querySelectorAll(':scope > .product-key-rate-item'));

  // Build table rows for each card
  const rows = cardItems.map((card) => {
    // Image/Icon (always present)
    const img = card.querySelector('img');

    // Title (span inside .key-value-text)
    const titleSpan = card.querySelector('.key-value-text span');
    let titleEl = null;
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent;
    }

    // Description (inside .key-top-text)
    const descContainer = card.querySelector('.key-top-text');
    let descEl = null;
    if (descContainer) {
      // If it contains a <p>, use the <p>
      const p = descContainer.querySelector('p');
      if (p) {
        descEl = p;
      } else {
        // Otherwise, use the whole .key-top-text div
        descEl = descContainer;
      }
    }

    // Compose the text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);

    return [img, textCellContent];
  });

  // Compose the table data
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
