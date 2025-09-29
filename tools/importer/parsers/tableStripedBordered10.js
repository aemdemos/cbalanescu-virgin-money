/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main comparison table block
  const mainTableDiv = Array.from(element.querySelectorAll(':scope > div')).find(div => div.classList.contains('cm-comparison-table'));
  if (!mainTableDiv) return;

  // Find the comparison-table-wrap-container
  const wrapContainer = mainTableDiv.querySelector('.comparison-table-wrap-container');
  if (!wrapContainer) return;

  // Find the actual table
  const table = wrapContainer.querySelector('table');
  if (!table) return;

  // Get the column headers from the first row in thead
  const theadTr = table.querySelector('thead tr');
  if (!theadTr) return;
  // The first th is a blank cell (row header), skip it
  const ths = Array.from(theadTr.querySelectorAll('th')).slice(1);
  const columnHeaders = ths.map(th => {
    // Use the inner text or the <b> element if present
    const b = th.querySelector('b');
    return b ? b.textContent.trim() : th.textContent.trim();
  });

  // Build the block header row
  const headerRow = ['Table (striped, bordered, tableStripedBordered10)'];

  // Build the second row: the table column headers
  // The first column is the row label (e.g., Overview, Welcome Offer, etc.)
  const secondRow = [''].concat(columnHeaders);

  // Now, parse tbody rows
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // For each row, build an array: first cell is the row header, then the data cells
  const dataRows = rows.map(tr => {
    const cells = [];
    // First cell is always a th (row label)
    const rowHeader = tr.querySelector('th');
    // Some rows have no label (e.g., the Apply/More Info row), use blank
    if (rowHeader && rowHeader.textContent.trim()) {
      // Preserve HTML formatting (e.g., <b>)
      const span = document.createElement('span');
      span.innerHTML = rowHeader.innerHTML.trim();
      cells.push(span);
    } else {
      cells.push('');
    }
    // Then, all td cells (one per column)
    const tds = Array.from(tr.querySelectorAll('td'));
    tds.forEach(td => {
      // Defensive: if cell has only whitespace, push blank
      if (!td.textContent.trim() && !td.querySelector('*')) {
        cells.push('');
      } else {
        // If the cell contains multiple elements, keep them together
        // We want to preserve the original HTML structure for resilience
        if (td.children.length > 0) {
          if (td.children.length === 1) {
            cells.push(td.children[0]);
          } else {
            // Multiple children: keep all as a fragment
            const frag = document.createDocumentFragment();
            Array.from(td.children).forEach(child => frag.appendChild(child));
            cells.push(frag);
          }
        } else {
          // Just text content, preserve HTML (e.g., <b>, <sup>, etc.)
          const span = document.createElement('span');
          span.innerHTML = td.innerHTML.trim();
          cells.push(span);
        }
      }
    });
    return cells;
  });

  // Compose the final cells array
  const cells = [headerRow, secondRow, ...dataRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
