/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: EXACTLY one cell containing the block name
  const headerRow = ['Columns (columns44)'];

  // Find columns in the block
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // Defensive: only proceed if columns found
  if (slItems.length === 0) return;

  // Each sl-item is a column. For each, grab the main block content
  const contentRow = slItems.map((item) => {
    // Prefer figure for images
    const fig = item.querySelector('figure');
    if (fig) return fig;
    // Or rich text
    const rich = item.querySelector('.cm-rich-text');
    if (rich) return rich;
    // Fallback: the item itself
    return item;
  });

  // Build table rows. Header row must be a single-cell array, content row has one cell per column
  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
