/* global WebImporter */
export default function parse(element, { document }) {
  // Get the columns from the block
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const items = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  // Extract the main presentational element for each column
  const columns = items.map(item => {
    const section = item.querySelector('section');
    if (section) return section;
    const paragraph = item.querySelector('.cq-dd-paragraph');
    if (paragraph) return paragraph;
    return item;
  });
  // Header row: exactly one column (NOT one cell per content column)
  const headerRow = ['Columns (columns14)'];
  // Data row: one cell per content column
  const tableRows = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
