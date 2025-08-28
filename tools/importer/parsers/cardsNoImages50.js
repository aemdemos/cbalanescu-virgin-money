/* global WebImporter */
export default function parse(element, { document }) {
  // Block header, matches example exactly
  const headerRow = ['Cards (cardsNoImages50)'];

  // Extract all card items (direct children)
  const cardItems = Array.from(element.querySelectorAll(':scope > .item'));

  // Handle edge case: if no cards, keep only header
  const rows = cardItems.length > 0 ? cardItems.map((item) => {
    // Reference actual heading and description, preserving HTML structure
    const heading = item.querySelector('h5');
    const description = item.querySelector('p');
    // Assemble cell contents in correct semantic order
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);
    // Always return an array for the single cell in the row
    return [cellContent];
  }) : [];

  // Build table: header row + card rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(table);
}
