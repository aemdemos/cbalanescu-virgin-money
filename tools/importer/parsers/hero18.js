/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero18)'];

  // 2. Background image row (none in this source)
  const bgImageRow = [''];

  // 3. Content row: extract all content from the main rich text block
  const contentPanel = element.querySelector('.cm-content-panel-container') || element;
  const richText = contentPanel.querySelector('.cm-rich-text') || contentPanel;

  // Use the actual existing element for the content cell (do not clone)
  const contentRow = [richText];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImageRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
