/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main visual content panel (background image row is empty for this HTML)
  let contentPanel = element.querySelector('.cm-content-panel-container');
  if (!contentPanel) contentPanel = element;
  let richText = contentPanel.querySelector('.cm-rich-text');
  if (!richText) richText = contentPanel;

  // Build the block table
  const headerRow = ['Hero (hero24)'];
  const backgroundRow = ['']; // No background image in this case
  const contentRow = [richText]; // Place the entire content block (includes heading, subheading, CTA)

  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
