/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main table inside the element
  const table = element.querySelector('table');
  if (!table) return;

  // Get table headers (the product/column names) from thead, skipping the first (label) column
  const thead = table.querySelector('thead');
  let productHeaders = [];
  if (thead) {
    const ths = thead.querySelectorAll('tr:first-child th');
    for (let i = 1; i < ths.length; i++) {
      // Use the HTML to preserve any formatting, like <b>
      productHeaders.push(ths[i].innerHTML.trim() || '');
    }
  }

  // Prepare the cells for the output block table
  const cells = [];
  // First row: single cell with block name
  cells.push(['Table']);
  // Second row: first column is empty (for row labels), then product headers
  cells.push(['', ...productHeaders]);

  // Now add the data rows
  const tbody = table.querySelector('tbody');
  if (tbody) {
    const trs = tbody.querySelectorAll('tr');
    trs.forEach(tr => {
      // The first cell is the row label (from the th, if present)
      let rowLabel = '';
      const th = tr.querySelector('th');
      if (th) {
        rowLabel = th.innerHTML.trim();
      }
      // All td cells (columns)
      const tds = tr.querySelectorAll('td');
      const rowCells = [rowLabel];
      tds.forEach(td => {
        // If cell has multiple child nodes, collect all (preserve elements)
        if (td.childNodes.length > 1) {
          const arr = [];
          td.childNodes.forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim() !== '') {
              arr.push(document.createTextNode(node.textContent));
            } else if (node.nodeType === 1) {
              arr.push(node);
            }
          });
          rowCells.push(arr.length === 1 ? arr[0] : arr);
        } else if (td.childNodes.length === 1) {
          rowCells.push(td.childNodes[0]);
        } else {
          rowCells.push(td.textContent.trim());
        }
      });
      cells.push(rowCells);
    });
  }

  // Create the block table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
