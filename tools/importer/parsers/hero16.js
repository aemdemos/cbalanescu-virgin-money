/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly
  const headerRow = ['Hero (hero16)'];

  // Image row: no image in provided HTML, so empty
  const imageRow = [''];

  // Content row: use all content inside the element, preserving structure
  // We want to reference the existing <p> (with link) as the content cell
  let contentCell;
  // use all children if >1, else just the single p node for robustness
  const directChildren = Array.from(element.children);
  if (directChildren.length === 1) {
    contentCell = directChildren[0];
  } else if (directChildren.length > 1) {
    const frag = document.createDocumentFragment();
    directChildren.forEach(child => frag.appendChild(child));
    contentCell = frag;
  } else {
    // fallback if element has no children
    contentCell = '';
  }
  const contentRow = [contentCell];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
