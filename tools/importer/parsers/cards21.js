/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract title and link from a card
  function extractCardContent(card) {
    // Find image
    const img = card.querySelector('img');
    // Find title (h2)
    const h2 = card.querySelector('h2');
    // Find link (wraps both image and text)
    const link = card.querySelector('a');
    let textContent;
    if (h2 && link) {
      // Create a link with the h2's text
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = h2.textContent.trim();
      textContent = a;
    } else if (h2) {
      textContent = h2.textContent.trim();
    } else {
      textContent = '';
    }
    return [img, textContent];
  }

  // Get all cards
  const cards = Array.from(element.querySelectorAll(':scope > .sl-list > .sl-item'));
  const rows = cards.map((card) => {
    const section = card.querySelector('section');
    if (!section) return ['', ''];
    const [img, textContent] = extractCardContent(section);
    return [img, textContent];
  });

  // Build table
  const headerRow = ['Cards (cards21)'];
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(table);
}
