/* global WebImporter */
export default function parse(element, { document }) {
  // Check for .sl-list with .sl-item children
  const slList = Array.from(element.querySelectorAll(':scope > .sl > .sl-list'))[0];
  if (!slList) return;
  const slItems = Array.from(slList.children).filter(el => el.classList.contains('sl-item'));
  if (slItems.length < 2) return;

  // First column: image panel (panel with image)
  const col1Panel = slItems[0].querySelector('.cm-content-panel-container');
  let col1Content;
  if (col1Panel) {
    col1Content = col1Panel;
  } else {
    col1Content = slItems[0];
  }

  // Second column: heading, paragraphs, button
  // Use the .cm-rich-text inside second sl-item if present, else sl-item itself
  const col2Panel = slItems[1].querySelector('.cm-rich-text');
  let col2Content;
  if (col2Panel) {
    col2Content = col2Panel;
  } else {
    col2Content = slItems[1];
  }

  // Table header matches example exactly
  const headerRow = ['Columns (columns32)'];

  // Table second row: two columns
  const secondRow = [col1Content, col2Content];

  // Final table
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
