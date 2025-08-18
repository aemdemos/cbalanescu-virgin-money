/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the example
  const headerRow = ['Hero (hero11)'];

  // Background row (no image element present, so null)
  const backgroundRow = [null];

  // Gather all content nodes from the main content panel
  // The .cm-rich-text div holds all hero text, links, etc.
  const richContent = element.querySelector('.cm-rich-text') || element;

  // Collect all direct children, including elements and non-empty text nodes
  const cellContent = [];
  richContent.childNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      cellContent.push(node);
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim().length > 0) {
        // Wrap non-empty text nodes in a span to preserve formatting in cell
        const span = document.createElement('span');
        span.textContent = node.textContent;
        cellContent.push(span);
      }
    }
  });

  // Content row containing all gathered nodes
  const contentRow = [cellContent];

  // Build the table
  const cells = [headerRow, backgroundRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original block
  element.replaceWith(block);
}
