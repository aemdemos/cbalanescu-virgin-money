/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row as per specification
  const headerRow = ['Columns (columns33)'];

  // Find the primary columns container: .sl-list
  const slList = element.querySelector('.sl-list');
  let columns = [];

  if (slList) {
    // Get all direct .sl-item children
    const items = slList.querySelectorAll(':scope > .sl-item');
    // Normally two columns, but handle variable count gracefully
    columns = Array.from(items).map(item => {
      // Get the main content block within this item
      const cm = item.querySelector('.cm.cm-rich-text');
      // If a .cm.cm-rich-text exists, use that. Otherwise, fallback to .sl-item itself.
      return cm ? cm : item;
    });
  } else {
    // Fallback: treat top-level direct children as columns
    columns = Array.from(element.querySelectorAll(':scope > div'));
  }
  // Edge case: no columns found, just use the element itself as a single cell
  if (columns.length === 0) {
    columns = [element];
  }

  // Construct the cells array for the table
  const cells = [
    headerRow,
    columns
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element in the document
  element.replaceWith(block);
}
