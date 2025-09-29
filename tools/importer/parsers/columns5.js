/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .sl-list (the columns container)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all immediate .sl-item children (each is a column)
  const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (items.length === 0) return;

  // Each .sl-item contains a .cm-rich-text with the actual content
  const cells = items.map(item => {
    const content = item.querySelector('.cm-rich-text, .cm');
    // Defensive: fallback to the item itself if .cm-rich-text is missing
    return content ? content : item;
  });

  // Table header row (block name)
  const headerRow = ['Columns (columns5)'];

  // Table content row: one cell per column
  const contentRow = cells;

  const tableCells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
