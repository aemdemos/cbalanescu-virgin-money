/* global WebImporter */
export default function parse(element, { document }) {
  // Header matches exactly: 'Columns (columns44)'
  const headerRow = ['Columns (columns44)'];

  // Defensive: find the .sl-list (columns) and its children
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // First column: Image, preserve the entire figure if present
  let imageCell = '';
  const imgFigure = slItems[0].querySelector('figure');
  if (imgFigure) {
    imageCell = imgFigure;
  } else {
    // fallback: find first image section or img
    const imgSection = slItems[0].querySelector('.cm-image, img');
    if (imgSection) {
      imageCell = imgSection;
    }
  }

  // Second column: Rich text content
  // Use the full .cm-rich-text block for best resilience
  let contentCell = '';
  const richText = slItems[1].querySelector('.cm-rich-text');
  if (richText) {
    contentCell = richText;
  }

  // Create the block table: header, then one row with two columns
  const cells = [
    headerRow,
    [imageCell, contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
