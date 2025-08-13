/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the .sl-list (contains the columns)
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  // Get all direct children .sl-item (columns)
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));

  // Prepare the header row as per requirements
  const cells = [['Columns (columns54)']];

  // Prepare the columns/cells for the main row
  const cols = [];
  for (let i = 0; i < slItems.length; i++) {
    const item = slItems[i];
    // First column: image section
    if (i === 0) {
      // Use the full section (contains figure/div/img)
      const imageSection = item.querySelector('section.cm-image');
      cols.push(imageSection ? imageSection : '');
    } else if (i === 1) {
      // Use the full .cm-rich-text block, which contains all relevant text and app store links
      const richText = item.querySelector('.cm-rich-text');
      cols.push(richText ? richText : '');
    } else {
      cols.push('');
    }
  }
  // Always ensure two columns (pad if needed)
  while (cols.length < 2) cols.push('');

  cells.push(cols);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table block
  element.replaceWith(block);
}
