/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the sl-list (the columns container)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all direct child .sl-item (each is a column)
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length === 0) return;

  // Each .sl-item contains a .cm (content module)
  const columns = slItems.map((item) => {
    // Find the first child with class .cm (should be only one)
    const cm = item.querySelector('.cm');
    // Defensive: if not found, fallback to the item itself
    return cm || item;
  });

  // Build the table rows
  const headerRow = ['Columns (columns24)'];
  const columnsRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
