/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children matching selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // Find the main columns container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the two main columns (sl-item)
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;
  const slItems = getDirectChildren(slList, '.sl-item');
  if (slItems.length < 2) return;

  // --- First Column: Card title and image ---
  const firstCol = document.createElement('div');
  // Get the card title (keep heading structure)
  const cardTitle = slItems[0].querySelector('.cm-rich-text');
  if (cardTitle) {
    firstCol.appendChild(cardTitle.cloneNode(true));
  }
  // Get the card image
  const cardImgSection = slItems[0].querySelector('.cm-image');
  if (cardImgSection) {
    firstCol.appendChild(cardImgSection.cloneNode(true));
  }

  // --- Second Column: Offer panels and accordions ---
  const secondCol = document.createElement('div');
  // Get ALL content panels and accordions in the second column
  const panels = slItems[1].querySelectorAll('.cm-content-panel-container');
  panels.forEach(panel => {
    secondCol.appendChild(panel.cloneNode(true));
  });
  const accordions = slItems[1].querySelectorAll('.cm-accordion');
  accordions.forEach(acc => {
    secondCol.appendChild(acc.cloneNode(true));
  });

  // Compose the table rows
  const headerRow = ['Columns (columns3)'];
  const contentRow = [firstCol, secondCol];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
