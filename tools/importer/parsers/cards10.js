/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Cards (cards10)'];
  
  // Find the main card list container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  
  const cardRows = [];
  // Each .sl-item contains 1 or more card sections
  Array.from(slList.children).forEach(slItem => {
    const cards = slItem.querySelectorAll('section.cm-icon-title');
    cards.forEach(card => {
      // First cell: image/icon (if present)
      const headerDiv = card.querySelector('.header');
      const img = headerDiv ? headerDiv.querySelector('img') : null;
      // Second cell: text content
      // Use heading as bold, preserve a11y/semantics
      const title = headerDiv ? headerDiv.querySelector('h2') : null;
      const contentDiv = card.querySelector('.content');
      const desc = contentDiv ? contentDiv.querySelector('p') : null;
      // Compose text cell
      const textFragment = document.createDocumentFragment();
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textFragment.appendChild(strong);
      }
      if (desc) {
        // Add a space if title exists
        if (title) {
          textFragment.appendChild(document.createElement('br'));
        }
        // Insert the actual <p> node (not cloning)
        textFragment.appendChild(desc);
      }
      // Use array so both bold and description are in one cell
      cardRows.push([img, Array.from(textFragment.childNodes)]);
    });
  });

  const tableCells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
