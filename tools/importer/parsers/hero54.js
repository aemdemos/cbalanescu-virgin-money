/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero54)'];

  // 2. Background image row (none present in source HTML)
  const imageRow = [''];

  // 3. Content row: gather all content from .cm-rich-text
  const richText = element.querySelector('.cm-rich-text');
  let contentCell = '';
  if (richText) {
    // Collect all children of richText (preserves all text and structure)
    const cellContent = document.createElement('div');
    Array.from(richText.childNodes).forEach((node) => {
      cellContent.appendChild(node.cloneNode(true));
    });
    contentCell = [cellContent];
  } else {
    // Defensive: fallback to all children
    const fallbackContent = document.createElement('div');
    Array.from(element.childNodes).forEach((node) => {
      fallbackContent.appendChild(node.cloneNode(true));
    });
    contentCell = [fallbackContent];
  }

  // Compose table rows
  const rows = [
    headerRow,
    imageRow,
    contentCell
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
