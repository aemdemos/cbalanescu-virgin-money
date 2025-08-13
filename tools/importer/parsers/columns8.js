/* global WebImporter */
export default function parse(element, { document }) {
  // Check for top-level nav-footer ul
  const navList = element.querySelector('ul.nav-footer');
  if (!navList) return;
  // Get all top level columns (LIs)
  const columns = Array.from(navList.children).filter(node => node.tagName === 'LI');
  // If no columns, do nothing
  if (!columns.length) return;

  // Each LI represents a column: use the full <li> to preserve structure, including spans, lists, links, icons
  const cells = [
    ['Columns (columns8)'], // Header row, exactly matching the example
    columns
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
