/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, matching the example precisely
  const headerRow = ['Columns (columns44)'];

  // Find the column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the sl-list (the container for the columns)
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  // Get all columns (sl-item elements)
  const slItems = slList.querySelectorAll(':scope > .sl-item');

  // For each column, gather its content block as seen in the HTML
  const columns = Array.from(slItems).map((item) => {
    // Try to find known blocks inside each column
    const imageSection = item.querySelector('.cm-image');
    if (imageSection) {
      return imageSection;
    }
    const richTextSection = item.querySelector('.cm-rich-text');
    if (richTextSection) {
      return richTextSection;
    }
    // As fallback, use the entire sl-item if other selectors fail
    return item;
  });

  // Check for expected number of columns (example shows 2 columns)
  if (columns.length < 2) return;

  // Build table block
  const cells = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
