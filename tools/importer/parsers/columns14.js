/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell (single column)
  const headerRow = ['Columns (columns14)'];

  // Find the .sl-list container
  const columnsRoot = element.querySelector('.sl-list');
  if (!columnsRoot) return;

  // Get .sl-item children
  const slItems = Array.from(columnsRoot.children);

  // First column: heading
  let firstColContent = '';
  if (slItems[0]) {
    const heading = slItems[0].querySelector('.cm-rich-text');
    if (heading) {
      firstColContent = heading;
    } else {
      firstColContent = slItems[0];
    }
  }

  // Second and third columns: .cm-icon-title
  let secondColSections = [];
  let thirdColSections = [];
  if (slItems[1]) {
    secondColSections = Array.from(slItems[1].querySelectorAll('.cm-icon-title'));
  }
  if (slItems[2]) {
    thirdColSections = Array.from(slItems[2].querySelectorAll('.cm-icon-title'));
  }

  // Determine max columns for content rows
  const columns = [firstColContent, secondColSections[0] || '', thirdColSections[0] || ''];
  // Create the first content row with all three columns
  const contentRows = [columns];
  // If there are more icon-titles in second or third column, add another row
  if (secondColSections[1] || thirdColSections[1]) {
    contentRows.push([
      '',
      secondColSections[1] || '',
      thirdColSections[1] || ''
    ]);
  }

  // Now structure the table as per spec: first row is single cell, then n-column rows
  const rows = [headerRow, ...contentRows];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
