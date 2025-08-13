/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find sl-list (which should have .sl-item columns)
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  // Get only direct .sl-item children (columns)
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length < 2) return;

  // Helper to collect all visible content (text and elements) in a node
  function collectContent(node) {
    const children = [];
    node.childNodes.forEach(child => {
      // Keep text nodes with non-empty text
      if (child.nodeType === Node.TEXT_NODE) {
        const txt = child.textContent.trim();
        if (txt) children.push(document.createTextNode(txt));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        children.push(child);
      }
    });
    return children;
  }

  // Build content for each column
  // Column 1: all content in first .sl-item
  const col1 = collectContent(slItems[0]);

  // Column 2: all content in second .sl-item, plus any additional panels & accordions after main sl-list
  const col2Content = collectContent(slItems[1]);
  // Find extra .cm-content-panel-container and .cm-accordion siblings after sl-list (NOT inside sl-item)
  const siblingPanels = Array.from(columnContainer.querySelectorAll(
    ':scope > .cm-content-panel-container, :scope > .cm-accordion'
  ));
  // Add them to column 2 if present
  siblingPanels.forEach(panel => {
    col2Content.push(panel);
  });

  // Compose the columns table
  const headerRow = ['Columns (columns19)'];
  const columnsRow = [col1, col2Content];
  const cells = [headerRow, columnsRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
