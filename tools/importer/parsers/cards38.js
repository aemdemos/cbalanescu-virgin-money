/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the table
  const headerRow = ['Cards (cards38)'];

  // Find all card sections
  const cardSections = Array.from(element.querySelectorAll('section.cm-content-tile, section.cm.cm-content-tile'));

  const rows = cardSections.map(section => {
    // First cell: first <img> found in the card
    const img = section.querySelector('img');
    const imageCell = img || '';

    // Second cell: reference the entire .content block (all heading, text, links, etc)
    const contentDiv = section.querySelector('.content');
    let textCell = '';
    if (contentDiv) {
      // Remove empty subheading paragraphs (if any)
      Array.from(contentDiv.querySelectorAll('p.subheading')).forEach(p => {
        if (!p.textContent.trim()) {
          p.remove();
        }
      });
      // Reference the content block for the table cell
      textCell = contentDiv;
    }
    return [imageCell, textCell];
  });
  
  // Build the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(table);
}
