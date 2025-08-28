/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Cards (cardsNoImages1)'];

  // Get all direct children with class 'item' (each card)
  const cardItems = Array.from(element.querySelectorAll(':scope > .item'));

  // If there are no cards, don't do anything
  if (cardItems.length === 0) return;

  // Each card row should contain only the original card element (retains all text/formatting)
  const rows = cardItems.map(card => [card]);

  // Table data: header row + card rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new structured block
  element.replaceWith(block);
}
