/* global WebImporter */
export default function parse(element, { document }) {
  // Find columns: .sl-list > .sl-item
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    columns = Array.from(slList.children).map(slItem => {
      const panel = slItem.querySelector('.cm-content-panel-container');
      return panel ? panel : slItem;
    });
  }
  // Header row: one cell that spans all columns (use colspan)
  // We'll create the table manually to ensure correct header spanning
  const table = document.createElement('table');
  // Header row
  const headerRow = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns39)';
  th.colSpan = columns.length > 0 ? columns.length : 1; // span all columns
  headerRow.appendChild(th);
  table.appendChild(headerRow);
  // Content row
  if (columns.length > 0) {
    const row = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      td.append(col);
      row.appendChild(td);
    });
    table.appendChild(row);
  }
  element.replaceWith(table);
}
