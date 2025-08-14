/* global WebImporter */
export default function parse(element, { document }) {
  // The block is "Columns (columns36)"; no Section Metadata table is required.
  // There are two main columns. Each is a .sl-item in the top-level .sl-list.has-2-items
  // Each column contains its own content panel, icon sections, and CTA

  // 1. Find the top-level .column-container and .sl-list.has-2-items
  let container = element.querySelector(':scope > .column-container');
  if (!container) container = element;
  let sl = container.querySelector(':scope > .sl');
  if (!sl) sl = container;
  let slList = sl.querySelector(':scope > .sl-list.has-2-items');
  if (!slList) slList = sl;

  // 2. Get direct child .sl-item columns
  const columns = Array.from(slList.children).filter(c => c.classList.contains('sl-item'));

  // 3. For each column, collect all content blocks that are part of the column
  function getColumnContent(slItem) {
    // Get all direct children of the sl-item that are block-level content
    const blocks = [];
    // The panel at the top
    const panel = slItem.querySelector(':scope > .cm-content-panel-container');
    if (panel) blocks.push(panel);
    // After the panel: all cm-icon-title and cm-rich-text siblings
    let next = panel ? panel.nextElementSibling : slItem.firstElementChild;
    while (next) {
      if (
        next.classList && (
          next.classList.contains('cm-icon-title') ||
          next.classList.contains('cm-rich-text')
        )
      ) {
        blocks.push(next);
      }
      next = next.nextElementSibling;
    }
    // If nothing gathered, fallback to all children
    if (blocks.length === 0) {
      blocks.push(...slItem.childNodes);
    }
    // Remove any empty text nodes
    const result = blocks.filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    // Return as array if multiple, single element if only one
    return result.length === 1 ? result[0] : result;
  }

  const tableRows = [];
  // Header matches the example exactly
  tableRows.push(['Columns (columns36)']);
  // Each column's content is an array of its content blocks
  tableRows.push(columns.map(getColumnContent));

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
