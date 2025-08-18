/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per requirements
  const headerRow = ['Columns (columns32)'];

  // Find the columns: .sl-list > .sl-item (each column is an sl-item)
  const slList = element.querySelector('.sl-list');
  const slItems = slList ? Array.from(slList.children).filter(child => child.classList.contains('sl-item')) : [];

  // Edge case: if no columns found, do nothing
  if (slItems.length === 0) return;

  // For each column, extract the main content:
  // - If it has a .cm-content-panel-container, use that
  // - Otherwise, use the .cm-rich-text, else the whole sl-item
  const columnsRow = slItems.map((item) => {
    let content = null;
    const panel = item.querySelector('.cm-content-panel-container');
    const rich = item.querySelector('.cm-rich-text');
    if (panel) {
      content = panel;
    } else if (rich) {
      content = rich;
    } else {
      content = item;
    }
    return content;
  });

  // Table structure: header row, then the columns row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
