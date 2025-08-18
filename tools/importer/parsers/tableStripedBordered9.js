/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the comparison table
  const tableBlock = element.querySelector('.cm-comparison-table');
  if (!tableBlock) return;
  const sourceTable = tableBlock.querySelector('table');
  if (!sourceTable) return;

  // 2. Build the cells array
  const cells = [];

  // -- Header row: block name, single cell
  cells.push(['Table (striped, bordered)']);

  // -- Second row: column headers (row label then column headers)
  const headerRow = sourceTable.querySelector('thead tr');
  if (!headerRow) return;
  const ths = Array.from(headerRow.children);
  const columnHeaders = ths.map(th => {
    // If only one child, reference that, else the th itself
    if (th.childNodes.length === 1) {
      return th.firstChild;
    } else {
      return th;
    }
  });
  cells.push(columnHeaders);

  // -- Data rows
  const tbodyRows = Array.from(sourceTable.querySelectorAll('tbody tr'));
  tbodyRows.forEach(tr => {
    // For each <tr>, get a FLAT array of cells
    const tds = Array.from(tr.children).map(td => {
      // If empty, use ''
      if (td.innerHTML.trim() === '') return '';
      // If the cell only has one child, reference that, else use the td/th itself
      // But DO NOT wrap the td or th in another cell, just reference its content
      if (td.childNodes.length === 1) {
        return td.firstChild;
      } else {
        // Instead of referencing td itself (which would create nested <td>s),
        // we want to reference its childNodes as an array if there's more than one
        const contents = Array.from(td.childNodes).filter(node => {
          // ignore empty text nodes
          return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
        });
        // If only one meaningful child, just return it, else return array
        if (contents.length === 1) {
          return contents[0];
        } else if (contents.length > 1) {
          return contents;
        } else {
          return '';
        }
      }
    });
    cells.push(tds);
  });

  // 3. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
