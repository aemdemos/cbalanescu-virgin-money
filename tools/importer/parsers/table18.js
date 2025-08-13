/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual table inside the block
  const table = element.querySelector('table');
  if (!table) return;

  // The output cells: first row is always ['Table']
  const cells = [['Table']];

  // Extract the table rows
  // We want each row of the source table (including header row for columns)
  // The source table's header row is the second row in the output
  const thead = table.querySelector('thead');
  if (thead) {
    const headerRow = thead.querySelector('tr');
    if (headerRow) {
      // Collect all th elements (including the first, which is the row label cell)
      const ths = Array.from(headerRow.querySelectorAll('th'));
      const headerCells = ths.map(th => {
        // Use all childNodes to retain bolding or formatting
        return th.childNodes.length > 0 ? Array.from(th.childNodes) : th.textContent;
      });
      cells.push(headerCells);
    }
  }

  // Add all tbody rows
  const tbody = table.querySelector('tbody');
  if (tbody) {
    const trs = Array.from(tbody.querySelectorAll('tr'));
    trs.forEach(tr => {
      const tds = Array.from(tr.children);
      // For each cell, retain formatting and structure
      const rowCells = tds.map(td => {
        return td.childNodes.length > 0 ? Array.from(td.childNodes) : td.textContent;
      });
      cells.push(rowCells);
    });
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
