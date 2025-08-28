/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Hero (hero8)'];

  // Defensive: get first child div, which holds image & content
  const innerDiv = element.firstElementChild;
  let imageBlock = null;
  let contentBlock = null;

  if (innerDiv) {
    // Find the image and content divs
    for (const child of innerDiv.children) {
      if (!imageBlock && child.classList.contains('image')) {
        imageBlock = child;
      }
      if (!contentBlock && child.classList.contains('content')) {
        contentBlock = child;
      }
    }
  }

  // If imageBlock is present, use it; otherwise, empty cell
  const rowImage = [imageBlock || ''];
  // If contentBlock is present, use it; otherwise, empty cell
  const rowContent = [contentBlock || ''];

  // Compose table
  const cells = [
    headerRow,
    rowImage,
    rowContent
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
