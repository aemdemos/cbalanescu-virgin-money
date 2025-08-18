/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly as in the example
  const headerRow = ['Columns (columns54)'];

  // Find the two rows (each sl-item in the top-level .sl-list)
  const topSlList = element.querySelector(':scope > div > div > div.sl-list');
  if (!topSlList) return;
  const rowItems = Array.from(topSlList.querySelectorAll(':scope > .sl-item'));

  // For this HTML, each row contains 4 logos (images), so we want 2 columns with 4 images each, matching the visual division of the example
  // So, each cell in the content row will be a <div> containing all 4 logo sections for each row

  // Prepare the two columns: left and right
  const columns = [];
  for (let i = 0; i < rowItems.length; i++) {
    const rowItem = rowItems[i];
    // Get the 4 logo sections in this row
    const innerList = rowItem.querySelector(':scope > .column-container > .sl > .sl-list');
    if (!innerList) {
      columns.push(document.createElement('div')); // Empty placeholder if missing
      continue;
    }
    const logoSections = Array.from(innerList.querySelectorAll(':scope > .sl-item > section.cm.cm-image'));
    // Put all logos into a <div>
    const cellDiv = document.createElement('div');
    logoSections.forEach(section => cellDiv.appendChild(section));
    columns.push(cellDiv);
  }

  // Compose table data: header, then a single row with two columns
  const tableData = [headerRow, columns];

  // Replace the original element with the table
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
