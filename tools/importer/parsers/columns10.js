/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top-level .sl-list with two .sl-item children
  const mainSlList = element.querySelector('.sl-list.has-2-items');
  if (!mainSlList) return;
  const mainSlItems = mainSlList.querySelectorAll(':scope > .sl-item');
  if (mainSlItems.length !== 2) return;

  // Helper to extract the content panel for each column
  function extractColumnContent(slItem) {
    const contentPanel = slItem.querySelector('.cm-content-panel-container');
    if (!contentPanel) return slItem.cloneNode(true);
    const div = document.createElement('div');
    // Get the inner .sl-list (image + heading)
    const innerSlList = contentPanel.querySelector('.sl-list.has-2-items');
    if (innerSlList) {
      const imgItem = innerSlList.querySelector(':scope > .sl-item:first-child img');
      if (imgItem) div.appendChild(imgItem.cloneNode(true));
      const headingItem = innerSlList.querySelector(':scope > .sl-item:last-child h3');
      if (headingItem) div.appendChild(headingItem.cloneNode(true));
    }
    // Get all .cm-icon-title sections
    contentPanel.querySelectorAll('section.cm-icon-title').forEach(section => {
      div.appendChild(section.cloneNode(true));
    });
    // Get the CTA at the end (if present)
    const cta = contentPanel.querySelector('.cm-rich-text.is-medium');
    if (cta) div.appendChild(cta.cloneNode(true));
    return div;
  }

  const leftColumn = extractColumnContent(mainSlItems[0]);
  const rightColumn = extractColumnContent(mainSlItems[1]);

  const headerRow = ['Columns (columns10)'];
  const contentRow = [leftColumn, rightColumn];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the outermost .cq-dd-paragraph (element) with the table
  element.replaceWith(table);
}
