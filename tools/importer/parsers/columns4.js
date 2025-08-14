/* global WebImporter */
export default function parse(element, { document }) {
  // The main column container holds the structure
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // The main inner section that holds the visual columns
  const sl = columnContainer.querySelector('.sl.has-top-border');
  if (!sl) return;

  // The sl-list arranges items into columns: first is left, second is right
  const slList = sl.querySelector('.sl-list');
  if (!slList || slList.children.length < 2) return;

  // LEFT column
  const leftCol = slList.children[0]; // .sl-item with .cm-rich-text
  let leftCellContent = null;
  // Look for .cm-rich-text module
  const richText = leftCol.querySelector('.cm-rich-text');
  leftCellContent = richText ? richText : leftCol;

  // RIGHT column
  const rightCol = slList.children[1];
  // Gather all .cm-icon-title sections (each is one contact method)
  const iconSections = rightCol.querySelectorAll('.cm-icon-title');
  let rightCellContent;
  if (iconSections.length) {
    // Put all icon-title sections (as references) into a wrapper div
    rightCellContent = document.createElement('div');
    iconSections.forEach(section => rightCellContent.appendChild(section));
  } else {
    // Fallback: use all children if sections aren't found
    rightCellContent = rightCol;
  }

  // Table header EXACTLY as specified
  const headerRow = ['Columns (columns4)'];
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
