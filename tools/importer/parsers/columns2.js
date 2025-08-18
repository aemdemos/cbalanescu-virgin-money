/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row, matching the example
  const headerRow = ['Columns (columns2)'];

  // Find the .sl-list which contains the column items
  const slList = element.querySelector('.sl-list');
  // If not found, fallback to all .sl-item under the element
  const slItems = slList ? slList.querySelectorAll(':scope > .sl-item') : element.querySelectorAll(':scope > .sl-item');
  // Get the column count (should be 2 for columns2)
  const items = Array.from(slItems);

  // Defensive: ensure we have at least one column
  if (items.length === 0) {
    // If no items found, replace with a block with only the header
    const table = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(table);
    return;
  }

  // For each column, reference its .cm-rich-text block (the actual content)
  const cells = items.map((item) => {
    // Find the rich text content for this column
    const richContent = item.querySelector('.cm-rich-text');
    // If missing, fallback to the whole item
    return richContent || item;
  });

  // Combine to final table structure: header row, then columns in second row
  const rows = [headerRow, cells];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
