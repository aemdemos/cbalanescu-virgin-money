/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches example
  const headerRow = ['Columns (columns2)'];

  // Find .sl-list (the actual columns container)
  const slList = element.querySelector('.sl-list');
  let columns = [];

  if (slList) {
    // Find all direct children .sl-item
    const slItems = slList.querySelectorAll(':scope > .sl-item');
    // For each, get the main content (the .cm child, or if absent, the item itself)
    columns = Array.from(slItems).map((item) => {
      // Each .sl-item only has one .cm direct child
      const content = item.querySelector(':scope > .cm');
      // Defensive: if .cm is missing, use the sl-item itself
      return content || item;
    });
  } else {
    // Fallback: treat all direct child divs as columns
    columns = Array.from(element.querySelectorAll(':scope > div'));
  }

  // If we have less than 2 columns, pad with empty string to ensure two columns
  while (columns.length < 2) {
    columns.push('');
  }

  // Only take the first 2 columns if there are more (enforce columns2 variant)
  columns = columns.slice(0, 2);

  // Compose table data
  const cells = [
    headerRow,
    columns
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
