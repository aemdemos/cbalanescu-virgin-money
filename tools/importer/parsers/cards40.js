/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as in the example
  const headerRow = ['Cards (cards40)'];
  const rows = [headerRow];

  // Select all cards, handling any number
  const cardSections = element.querySelectorAll('.cm-content-tile');

  cardSections.forEach(card => {
    // Image cell: use first img within card
    const img = card.querySelector('img');

    // Text cell: gather all child elements from .content except empty .subheading
    const contentDiv = card.querySelector('.content');
    const textElements = [];
    if (contentDiv) {
      Array.from(contentDiv.children).forEach(child => {
        // Skip empty or whitespace-only subheading
        if (
          child.classList &&
          child.classList.contains('subheading') &&
          !child.textContent.trim()
        ) {
          return;
        }
        textElements.push(child);
      });
    }

    // Ensure at least some text content is present for robustness
    rows.push([img, textElements.length ? textElements : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
