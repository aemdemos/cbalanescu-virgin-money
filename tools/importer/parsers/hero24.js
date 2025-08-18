/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content panel container
  const panel = element.querySelector('.cm-content-panel-container');
  // The content (title, subheading, cta) is inside cm-rich-text
  let contentCell = null;
  if (panel) {
    const richText = panel.querySelector('.cm-rich-text');
    // If richText exists, use it, otherwise fallback to the panel itself
    contentCell = richText || panel;
  } else {
    // Fallback in case structure changes
    const richText = element.querySelector('.cm-rich-text');
    contentCell = richText || element;
  }

  // Table header as specified
  const headerRow = ['Hero (hero24)'];
  // No background image for this example, so empty string
  const backgroundRow = [''];
  // The content (title, subheading, CTA) goes in the third row
  const contentRow = [contentCell];

  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}