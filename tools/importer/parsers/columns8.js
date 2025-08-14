/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main nav-footer list
  const navUL = element.querySelector('ul.nav-footer');
  if (!navUL) return;
  const navItems = Array.from(navUL.children);

  // Helper: extract column content as a block (heading + list)
  function extractColumnContent(li) {
    const colContent = document.createElement('div');
    // Heading
    const heading = li.querySelector(':scope > span');
    if (heading) {
      // Use <strong> for headings to keep semantic meaning
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      colContent.appendChild(strong);
    }
    // List
    const ul = li.querySelector(':scope > ul');
    if (ul) {
      // Instead of extracting just anchors, include the whole list structure
      colContent.appendChild(ul);
    }
    return colContent;
  }

  // Compose columns: each nav item becomes a column
  const cols = navItems.map(extractColumnContent);
  // Only include non-empty columns
  const filteredCols = cols.filter(col => col.childNodes.length);

  // Table as per example: header and one row with all columns
  const headerRow = ['Columns (columns8)'];
  const cells = [
    headerRow,
    filteredCols
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
