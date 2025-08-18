/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header: strictly as per instructions
  const headerRow = ['Columns (columns18)'];

  // 2. Find the columns: each .sl-item is a column
  let columns = [];
  const slList = element.querySelector('.sl-list');
  if (slList) {
    columns = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  }
  // Defensive fallback: look for .sl-item inside the element (shouldn't be needed)
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('.sl-item'));
  }

  // 3. For each column, extract the main .cm-rich-text content
  //    Reference the actual DOM element (do not clone or create)
  //    If missing, fallback to the .sl-item itself
  const contentRow = columns.map(col => {
    const rich = col.querySelector('.cm-rich-text');
    return rich || col;
  });

  // 4. Build the final cells array: header, then content row
  const cells = [headerRow, contentRow];

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element in-place
  element.replaceWith(block);
}
