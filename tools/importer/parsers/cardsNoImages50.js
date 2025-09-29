/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cardsNoImages50)'];

  // Defensive: Get all immediate child .item divs (each is a card)
  const items = Array.from(element.querySelectorAll(':scope > div.item'));

  // Each card row: gather heading and description
  const rows = items.map((item) => {
    // Find heading (h5) and description (p)
    const heading = item.querySelector('h5');
    const description = item.querySelector('p');
    // Compose cell content: heading (if exists), then description (if exists)
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);
    return [cellContent]; // 1 column per row
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(block);
}
