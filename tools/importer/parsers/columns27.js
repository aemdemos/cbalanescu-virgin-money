/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: one cell, block name
  const headerRow = ['Columns (columns27)'];

  // Find the column items (immediate children of .sl-list)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // For each .sl-item, use the .cm-rich-text.module__content.l-full-width div
  // fallback to .sl-item itself if not found
  const columns = slItems.map(item => {
    const rich = item.querySelector('.cm-rich-text.module__content.l-full-width');
    return rich || item;
  });

  // The second row must have as many columns as content blocks, header row is always ONE column
  const cells = [
    headerRow,
    columns
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
