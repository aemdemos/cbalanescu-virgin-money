/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header row: exactly one cell, block name
  const headerRow = ['Table (striped, bordered)'];

  // 2. Find the original table
  const table = element.querySelector('table');
  if (!table) return;
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  if (!thead || !tbody) return;

  // 3. Column header row: extract text/HTML from each <th> (not the element itself)
  const thRow = thead.querySelector('tr');
  if (!thRow) return;
  const tableHeaderRow = Array.from(thRow.children).map(th => th.innerHTML);

  // 4. Data rows: extract text/HTML from each cell (<th> or <td>), never pass the cell elements
  const blockRows = [];
  const trs = Array.from(tbody.querySelectorAll('tr'));
  trs.forEach(tr => {
    const rowCells = Array.from(tr.children).map(cell => cell.innerHTML);
    blockRows.push(rowCells);
  });

  // 5. Compose the output: header row, then table header, then all data rows
  const cells = [headerRow, tableHeaderRow, ...blockRows];

  // 6. Create and replace
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
