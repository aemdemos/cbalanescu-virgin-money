/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: must match example exactly
  const headerRow = ['Columns (columns33)'];

  // 2. Find sl-list (columns block) and its direct children
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // 3. Get each column's top-level sl-item
  const columnItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // 4. Each column: gather its rich content block (preserve structure)
  const columns = columnItems.map((item) => {
    // Find the .cm-rich-text block within this item
    const rich = item.querySelector('.cm-rich-text');
    if (rich) {
      return rich;
    }
    // fallback: entire item if structure differs
    return item;
  });

  // 5. Build the block table as per the example (header, then columns)
  const cells = [
    headerRow,
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the table
  element.replaceWith(table);
}