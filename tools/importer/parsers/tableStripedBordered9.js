/* global WebImporter */
export default function parse(element, { document }) {
  // Table block header
  const headerRow = ['Table (striped, bordered)'];

  // Find the main comparison table (there should only be one)
  // Reference the existing table node directly (do not clone)
  const table = element.querySelector('table');

  // Set up final cells array
  const cells = [headerRow];

  if (table) {
    // Reference the table directly
    cells.push([table]);
  } else {
    // In the edge case where there is no table, include all content inside cm-comparison-table
    const blockContent = element.querySelector('.cm-comparison-table');
    if (blockContent && blockContent.children.length > 0) {
      // group all children in an array
      const arr = Array.from(blockContent.children);
      cells.push([arr]);
    } else {
      // fallback: empty cell
      cells.push(['']);
    }
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with new block table
  element.replaceWith(block);
}
