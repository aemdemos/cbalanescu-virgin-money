/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header (matches example exactly)
  const headerRow = ['Columns (columns50)'];

  // 2. Find the two main columns (left and right)
  // The structure is: 
  // div.column-container
  //   > div.sl
  //     > div.sl-list.has-2-items
  //       > div.sl-item (left)
  //       > div.sl-item (right)
  const slList = element.querySelector('.sl-list.has-2-items');
  if (!slList) return; // edge case: no columns, don't create block
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  if (slItems.length < 2) return; // need at least 2 columns

  // 3. For each column, preserve all content inside the sl-item
  // Reference the actual sl-item DOM element (do not clone)
  // This keeps all headings, paragraphs, images, lists, etc. as in the HTML
  const leftColumn = slItems[0];
  const rightColumn = slItems[1];

  // 4. Table structure: two columns, one row (aside from header)
  const cells = [
    headerRow,
    [leftColumn, rightColumn],
  ];

  // 5. Create columns block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the table
  element.replaceWith(table);
}
