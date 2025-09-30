/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to build a column cell from a link-block
  function buildColumnCell(linkBlock) {
    const cellContent = [];
    // Get the h3 (main link)
    const h3 = linkBlock.querySelector('h3');
    if (h3) {
      // Clone h3 but remove arrow span
      const h3Clone = h3.cloneNode(true);
      const arrow = h3Clone.querySelector('.arrow');
      if (arrow) arrow.remove();
      // Remove empty text nodes
      h3Clone.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
          node.remove();
        }
      });
      cellContent.push(h3Clone);
    }
    // Get sublinks
    const sublinks = linkBlock.querySelector('.sublinks');
    if (sublinks) {
      // Create a ul of sublinks
      const ul = document.createElement('ul');
      sublinks.querySelectorAll('a').forEach((a) => {
        const li = document.createElement('li');
        li.appendChild(a.cloneNode(true));
        ul.appendChild(li);
      });
      cellContent.push(ul);
    }
    return cellContent;
  }

  // Get all link-blocks (columns)
  const columns = Array.from(element.querySelectorAll(':scope > .link-block'));
  const numColumns = columns.length;

  // Build the header row
  const headerRow = ['Columns (columns20)'];

  // Build the columns row (each cell is a column)
  const columnsRow = columns.map((col) => buildColumnCell(col));

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
