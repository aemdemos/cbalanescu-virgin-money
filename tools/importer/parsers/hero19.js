/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero19)'];

  // --- Row 2: Background image (optional) ---
  // This source block does NOT have a background image element, so leave cell empty
  const bgImageRow = [''];

  // --- Row 3: Content (title, subheading, CTA) ---
  // Find the rich text container
  let contentDiv = null;
  const children = element.querySelectorAll(':scope > div');
  for (const child of children) {
    if (child.classList.contains('cm-rich-text')) {
      contentDiv = child;
      break;
    }
  }
  // Defensive fallback: if not found, use the element itself
  if (!contentDiv) contentDiv = element;

  // Gather content elements: heading, paragraphs, links
  // We'll preserve their order and structure for resilience
  const contentEls = [];
  Array.from(contentDiv.childNodes).forEach((node) => {
    // Only include element nodes (skip text nodes)
    if (node.nodeType === 1) {
      contentEls.push(node);
    }
  });
  // Defensive fallback: if nothing found, use the whole contentDiv
  const contentRow = [contentEls.length ? contentEls : [contentDiv]];

  // Build the table
  const cells = [
    headerRow,
    bgImageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block table
  element.replaceWith(table);
}
