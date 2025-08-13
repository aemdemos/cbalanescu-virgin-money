/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name
  const headerRow = ['Columns (columns36)'];

  // 2. Find the two top-level columns (sl-item), each is a column
  const columnItems = Array.from(element.querySelectorAll(':scope > .column-container > .sl > .sl-list > .sl-item'));
  if (columnItems.length < 2) return; // Defensive: must have two columns

  // Helper: for a .sl-item panel, get its full content panel (everything relevant for that column)
  function getPanelContent(panel) {
    // Each panel has a .cm-content-panel-container which is the main content area
    const panelContainer = panel.querySelector(':scope > .cm-content-panel-container');
    if (!panelContainer) return [panel]; // fallback: just use the whole panel

    // Get the main two rows: 1. image+title+desc, 2. features list, 3. bottom CTA
    const content = [];
    // Get image+title+desc block
    const innerSlList = panelContainer.querySelector(':scope > .column-container > .sl > .sl-list');
    if (innerSlList) {
      // There should be two .sl-item: image and headline block
      const innerItems = innerSlList.querySelectorAll(':scope > .sl-item');
      if (innerItems.length === 2) {
        // We'll include both as is; preserves semantics and references existing nodes
        content.push(innerItems[0], innerItems[1]);
      } else {
        // fallback: include all .sl-item
        content.push(...innerItems);
      }
    }

    // Now, all the feature sections (cm-icon-title)
    // These are siblings of .cm-content-panel-container inside the .sl-item
    // We want the feature sections directly AFTER panelContainer
    let node = panelContainer.nextElementSibling;
    while (node && node.classList.contains('cm-icon-title')) {
      content.push(node);
      node = node.nextElementSibling;
    }

    // Finally, the bottom cta link (usually a .cm-rich-text with an <a>)
    // Find the first .cm-rich-text.module__content.l-full-width after the features
    while (node && (!node.classList.contains('cm-rich-text') || !node.querySelector('a'))) {
      node = node.nextElementSibling;
    }
    if (node && node.classList.contains('cm-rich-text') && node.querySelector('a')) {
      content.push(node);
    }

    return content;
  }

  // For each column, build the content array
  const leftContent = getPanelContent(columnItems[0]);
  const rightContent = getPanelContent(columnItems[1]);

  // 3. Build the table cell structure
  const cells = [
    headerRow,
    [leftContent, rightContent],
  ];

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
