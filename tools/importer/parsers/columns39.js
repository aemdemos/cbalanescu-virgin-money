/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches exactly: single cell
  const headerRow = ['Columns (columns39)'];

  // Find sl-list (row container)
  const slList = element.querySelector('.sl-list');
  const items = slList ? Array.from(slList.children) : [];

  // Each .sl-item is a column - extract its "panel" (full content)
  const columns = items.map(item => {
    const panel = item.querySelector('.cm-content-panel-container');
    return panel || item;
  });

  // According to the block example, the header row must have ONE cell,
  // and the content row must have as many columns as needed for the layout.
  // So, pass an array where first item is a 1-length array (header),
  // and the second item is an array of column contents (the content row).
  const cells = [headerRow, columns];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
