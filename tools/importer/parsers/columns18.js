/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Columns (columns18)'];

  // Defensive: get all top-level <li> in the nav > ul (the columns)
  const navUl = element.querySelector('ul.nav-footer');
  const columns = navUl ? Array.from(navUl.children) : [];

  // For each column, collect its content as a cell
  const contentRow = columns.map((col) => {
    // We'll use the entire <li> as the cell content for resilience
    return col;
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
