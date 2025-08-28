/* global WebImporter */
export default function parse(element, { document }) {
  // TABLE HEADER: Always exactly one cell, matches the block name
  const headerRow = ['Table (striped, bordered, tableStripedBordered10)'];

  // Find the main table
  const tableEl = element.querySelector('table');
  if (!tableEl) return;

  // Get the table's header row and body rows
  const thead = tableEl.querySelector('thead');
  const tbody = tableEl.querySelector('tbody');
  if (!thead || !tbody) return;

  // Build the second row: column headers (first cell is label, rest are products)
  const ths = Array.from(thead.querySelectorAll('tr:first-child th'));
  // First column header
  let labelHeaderCell;
  if (ths.length > 0) {
    // Use HTML structure for the label header (could be empty or contain formatting)
    labelHeaderCell = ths[0].childNodes.length ? ths[0] : ths[0].textContent;
  } else {
    labelHeaderCell = '';
  }
  // Product headers (use content from <b> if present, else th text)
  const productHeaderCells = ths.slice(1).map(th => {
    const b = th.querySelector('b');
    return b ? b : th.childNodes.length ? th : th.textContent;
  });
  const headerDataRow = [labelHeaderCell, ...productHeaderCells];

  // Compose all rows
  const tableArr = [headerRow, headerDataRow];

  // For each <tr> in tbody, build row with: [labelCell, ...dataCells]
  Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
    // Row label: always the first <th> (preserving formatting)
    let labelCell = '';
    const th = tr.querySelector('th');
    if (th) {
      // Use as is (not cloned) for resilience
      labelCell = th.childNodes.length ? th : th.textContent;
    }
    // Data: each <td>. Each cell should reference all its content
    const tds = Array.from(tr.querySelectorAll('td'));
    const dataCells = tds.map(td => {
      // If the cell contains elements (lists, links, spans, etc), use those
      if (td.childNodes.length > 0) {
        // Gather all child nodes (for flexibility & completeness)
        const items = [];
        td.childNodes.forEach(node => {
          // Only add non-empty text and elements
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return;
          items.push(node);
        });
        // If only one item, use it directly. Otherwise, use array
        if (items.length === 1) return items[0];
        if (items.length > 1) return items;
      }
      // Otherwise, use text
      return td.textContent.trim();
    });
    tableArr.push([labelCell, ...dataCells]);
  });

  // Build and replace the original element
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
