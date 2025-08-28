/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match exactly
  const headerRow = ['Columns (columns4)'];

  // Find the top-level columns by traversing column-container > sl > sl-list.has-2-items > sl-item
  const slList = element.querySelector(':scope > .column-container > .sl > .sl-list.has-2-items');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter((el) => el.classList.contains('sl-item'));

  // For each column, gather all content from its content panel container
  const columns = slItems.map((slItem) => {
    const panel = slItem.querySelector(':scope > .cm-content-panel-container');
    if (!panel) return null;
    // Include all child nodes from the content panel (not just elements), which includes text nodes
    // This ensures all text content and structure is preserved
    const colContent = Array.from(panel.childNodes).filter(node => {
      // Ignore empty text nodes or whitespace
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    return colContent;
  }).filter(colArr => colArr && colArr.length > 0);

  if (!columns.length) return;

  // Construct the table cells
  const cells = [
    headerRow,
    columns
  ];

  // Create block and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
