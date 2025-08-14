/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block, as in the example
  const headerRow = ['Cards (cards5)'];

  // Find all card sections: .cm.cm-content-tile
  const cardSections = Array.from(element.querySelectorAll('section.cm.cm-content-tile'));

  // Build rows for each card
  const rows = cardSections.map(card => {
    // Image cell: find .image img
    const imgEl = card.querySelector('.image img');
    // Text cell: use the .content div directly
    const contentDiv = card.querySelector('.content');
    // If either is missing, substitute null to keep table shape but avoid errors
    return [imgEl || '', contentDiv || ''];
  });

  // Compose the block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
