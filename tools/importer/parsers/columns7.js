/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per requirement
  const headerRow = ['Columns (columns7)'];

  // Find the container holding the columns (should be .sl-list)
  const slList = element.querySelector('.sl-list');
  let columns = [];

  if (slList) {
    // Each .sl-item is a column
    const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
    slItems.forEach((slItem) => {
      // For each column, try to capture the immediate major content
      // Left column: image
      const imageSection = slItem.querySelector('.cm-image');
      if (imageSection) {
        columns.push(imageSection);
      } else {
        // Right column: rich text and app store buttons
        const richContent = slItem.querySelector('.cm-rich-text');
        if (richContent) {
          columns.push(richContent);
        } else {
          // fallback, use the whole sl-item
          columns.push(slItem);
        }
      }
    });
  }

  // Fallback if columns could not be detected
  if (columns.length < 2) {
    // Try immediate children divs as fallback
    columns = Array.from(element.querySelectorAll(':scope > div'));
  }

  // Ensure each column is not empty, fallback to a blank div if needed
  columns = columns.map(col => col ? col : document.createElement('div'));

  // Table structure as per block spec: header row, then a row containing all columns
  const cells = [
    headerRow,
    columns
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
