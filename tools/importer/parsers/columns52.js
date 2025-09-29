/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter((child) => child.matches(selector));
  }

  // 1. Header row
  const headerRow = ['Columns (columns52)'];

  // 2. Get the main columns content
  // The structure is:
  // <div class="column-container">
  //   <div class="sl">
  //     <div class="sl-list has-3-items">
  //       <div class="sl-item">...</div>
  //       <div class="sl-item">...</div>
  //       <div class="sl-item">...</div>
  //     </div>
  //   </div>
  // </div>

  // Defensive: find the .sl-list inside the block
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Get all .sl-item direct children (columns)
  const slItems = getDirectChildren(slList, '.sl-item');

  // Defensive: if no items, do nothing
  if (!slItems.length) return;

  // For this layout, the first item is a heading column, the next two are icon-title sections
  // We'll create a single row with three columns
  const columnsRow = slItems.map((item) => {
    // For each item, extract its main content
    // If it contains a .cm-rich-text, use that
    const rich = item.querySelector('.cm-rich-text');
    if (rich) return rich;

    // If it contains a .cm-icon-title section, use the whole section
    const iconTitle = item.querySelector('.cm-icon-title');
    if (iconTitle) return iconTitle;

    // Fallback: use the item itself
    return item;
  });

  // Compose the table
  const tableCells = [headerRow, columnsRow];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
