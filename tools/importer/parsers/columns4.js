/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find all immediate .sl-item children (each = one column)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));

  // 2. Build the content row: one cell per column
  const columnsRow = slItems.map((slItem) => {
    const section = slItem.querySelector('section.cm-links-related');
    if (!section) return '';
    const parts = [];
    const h3 = section.querySelector('h3.header');
    if (h3) parts.push(h3);
    const ul = section.querySelector('ul.cf');
    if (ul) parts.push(ul);
    return parts;
  });

  // 3. Create the cells array: header is a single cell (first row), then a row with N columns
  const cells = [
    ['Columns (columns4)'], // header row: one cell only
    columnsRow             // content row: one cell per column
  ];

  // 4. Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
