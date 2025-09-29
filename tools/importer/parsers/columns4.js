/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top-level column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find all direct .sl > .sl-list.has-2-items > .sl-item > .cm-content-panel-container blocks (Earn/Redeem)
  const panels = Array.from(columnContainer.querySelectorAll(':scope > .sl > .sl-list.has-2-items > .sl-item > .cm-content-panel-container'));
  if (panels.length < 2) return;

  // Helper to extract all children for a panel as a single fragment
  function extractPanelContent(panel) {
    const frag = document.createElement('div');
    // Get the image/text header
    const slList = panel.querySelector('.sl-list.has-2-items');
    if (slList) {
      const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
      items.forEach(item => frag.appendChild(item.cloneNode(true)));
    }
    // Get all icon-title sections
    panel.querySelectorAll(':scope > section.cm.cm-icon-title').forEach(section => {
      frag.appendChild(section.cloneNode(true));
    });
    // Get the CTA at the end
    const cta = panel.querySelector(':scope > .cm-rich-text.module__content.l-full-width:last-of-type');
    if (cta) frag.appendChild(cta.cloneNode(true));
    return frag;
  }

  // Compose the two columns as single elements containing all content
  const leftColumn = extractPanelContent(panels[0]);
  const rightColumn = extractPanelContent(panels[1]);

  // Build the table rows
  const headerRow = ['Columns (columns4)'];
  const contentRow = [leftColumn, rightColumn];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
