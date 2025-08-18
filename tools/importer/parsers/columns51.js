/* global WebImporter */
export default function parse(element, { document }) {
  // Find the sl-list container that holds the columns
  const slList = element.querySelector('.sl-list');
  // Get all immediate child .sl-item elements
  const items = slList ? Array.from(slList.children) : [];

  // Prepare array for column cells (one cell per column)
  const columnCells = items.map((item) => {
    // Use the meaningful sub-element if present
    const cmSection = item.querySelector('section.cm-icon-title');
    if (cmSection) return cmSection;
    const richText = item.querySelector('.cm-rich-text.module__content');
    if (richText) return richText;
    // fallback to whole item
    return item;
  });

  // The header row must have one cell followed by empty cells for each column except the first
  const headerRow = ['Columns (columns51)'];
  while (headerRow.length < columnCells.length) {
    headerRow.push('');
  }

  const tableCells = [headerRow, columnCells];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(blockTable);
}
