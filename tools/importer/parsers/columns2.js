/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header
  const headerRow = ['Columns (columns2)'];

  // 2. Find the columns inside the block (each .sl-item is a column)
  const slList = element.querySelector('.sl-list');
  let columnEls = [];
  if (slList) {
    columnEls = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  }

  // 3. For each column, grab the main content element
  const columns = columnEls.map((colEl) => {
    // Prefer the deepest .cm-rich-text/module__content/l-full-width, fallback to the whole column
    const content = colEl.querySelector('.cm-rich-text') ||
      colEl.querySelector('.module__content') ||
      colEl.querySelector('.l-full-width') ||
      colEl;
    return content;
  });

  // 4. Handle edge cases: If no columns found, put all content in a single column
  const contentRow = columns.length > 0 ? columns : [element];

  // 5. Assemble the table structure
  const cells = [
    headerRow,
    contentRow
  ];

  // 6. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
