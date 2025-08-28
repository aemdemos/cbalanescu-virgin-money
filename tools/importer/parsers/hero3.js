/* global WebImporter */
export default function parse(element, { document }) {
  // Table structure: 1 column, 3 rows
  // Row 1: block name
  // Row 2: background image (none in original HTML)
  // Row 3: content (CTA link in a paragraph)

  const headerRow = ['Hero (hero3)'];
  const imageRow = ['']; // No image present in the HTML

  // Row 3: reference the existing content (the full cta paragraph)
  // For resilience, place the single child paragraph (if present), or all children.
  let contentCell;
  // If the element only contains one child, just use it, else, collect all children
  const children = Array.from(element.childNodes).filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
  if (children.length === 1) {
    contentCell = children[0];
  } else if (children.length > 1) {
    contentCell = children;
  } else {
    // fallback: reference the element itself if no children
    contentCell = element;
  }

  const cells = [
    headerRow,
    imageRow,
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
