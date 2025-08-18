/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container -- critical for extracting column structure
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  // Get the direct children representing the columns
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  // The block is expected to have at least 2 columns
  if (slItems.length < 2) return;

  // For each sl-item, extract the main block of content
  // - For the left column, it may contain a section.cm-image (image/figure)
  // - For the right column, it may contain .cm-rich-text (headings, paragraphs, links)
  // We reference the highest meaningful content element in each

  // Left column (image)
  let leftCol = null;
  const leftImageSection = slItems[0].querySelector('section.cm-image');
  if (leftImageSection) {
    leftCol = leftImageSection;
  } else {
    // fallback: use the entire sl-item if no image section found
    leftCol = slItems[0];
  }
  
  // Right column (text etc.)
  let rightCol = null;
  const rightRichText = slItems[1].querySelector('.cm-rich-text');
  if (rightRichText) {
    rightCol = rightRichText;
  } else {
    // fallback: use the entire sl-item if no text section found
    rightCol = slItems[1];
  }

  // Table header must EXACTLY match example: 'Columns (columns44)'
  const headerRow = ['Columns (columns44)'];

  // Second row: left and right columns as cells
  const secondRow = [leftCol, rightCol];

  // Compose final cells array for createTable
  const cells = [headerRow, secondRow];

  // Create and replace with table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
