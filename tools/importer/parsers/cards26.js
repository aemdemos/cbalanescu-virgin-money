/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a .sl-item
  function extractCard(slItem) {
    // Find the section containing the card
    const section = slItem.querySelector('section.cm-content-tile, section.cm');
    if (!section) return [document.createElement('div'), document.createElement('div')];

    // Image (first cell)
    let imageCell = null;
    const imageDiv = section.querySelector('.image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
    if (!imageCell) {
      imageCell = document.createElement('div');
    }

    // Text content (second cell)
    const contentDiv = section.querySelector('.content');
    let textCellContent = [];
    if (contentDiv) {
      // Title (h3.header > b)
      const header = contentDiv.querySelector('.header');
      if (header) {
        const h3 = document.createElement('h3');
        h3.innerHTML = header.innerHTML;
        textCellContent.push(h3);
      }
      // All paragraphs and lists (description, features, etc.)
      // We'll collect all elements except the header and image
      Array.from(contentDiv.children).forEach((child) => {
        if (child.classList.contains('header')) return;
        // Only add non-empty paragraphs and lists
        if (
          (child.tagName === 'P' && child.textContent.trim() !== '') ||
          child.tagName === 'UL' ||
          child.tagName === 'OL'
        ) {
          textCellContent.push(child);
        }
      });
    }
    // Defensive: if nothing found, add an empty div
    if (textCellContent.length === 0) {
      textCellContent.push(document.createElement('div'));
    }

    return [imageCell, textCellContent];
  }

  // Find all cards
  const slItems = element.querySelectorAll(':scope .sl-item');
  const rows = [];
  // Header row
  rows.push(['Cards (cards26)']);
  // Card rows
  slItems.forEach((slItem) => {
    rows.push(extractCard(slItem));
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
