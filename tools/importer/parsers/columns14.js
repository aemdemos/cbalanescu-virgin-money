/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list inside the element
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // Extract each section for the columns row
  const columnsRow = items.map((item) => {
    const section = item.querySelector('section.cm-image-block-link');
    return section ? section : document.createElement('div');
  });

  // Ensure the header row is a single cell exactly as specified
  const headerRow = ['Columns (columns14)'];

  // Table: first row is the header (single column), second row is columns (multiple columns)
  const cells = [headerRow, columnsRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}