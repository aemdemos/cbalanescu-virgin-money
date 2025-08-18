/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards43) block always starts with a header row
  const headerRow = ['Cards (cards43)'];
  const cells = [headerRow];

  // Get all immediate .sl-item children (each card)
  const cardElements = element.querySelectorAll('.sl-item');
  cardElements.forEach(cardEl => {
    // Find the image (must be first img inside the card)
    const img = cardEl.querySelector('img');

    // Find rich text container
    const richText = cardEl.querySelector('.cm-rich-text');
    let textElements = [];
    if (richText) {
      // Gather all children except the paragraph containing the image
      Array.from(richText.children).forEach(child => {
        if (!(child.tagName === 'P' && child.querySelector('img'))) {
          textElements.push(child);
        }
      });
    }
    // Edge case: if image missing, cell will be empty
    // Second cell: all text elements as array (preserves headings, links, formatting)
    cells.push([
      img || '',
      textElements.length ? textElements : ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(table);
}
