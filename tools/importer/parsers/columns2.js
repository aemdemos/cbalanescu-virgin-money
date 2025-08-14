/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Define the header row exactly as specified
  const headerRow = ['Columns (columns2)'];

  // 2. Find the columns. For this HTML, the columns are .sl-item children
  // which each contain a .cm.cm-rich-text.module__content block.
  const slList = element.querySelector('.sl-list.has-2-items');
  let columns = [];
  if (slList) {
    // Each direct child .sl-item is a column
    const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
    columns = slItems.map((item) => {
      // Each .sl-item contains a .cm.cm-rich-text.module__content as the main content
      const content = item.querySelector(':scope > .cm.cm-rich-text.module__content');
      return content ? content : item;
    });
  } else {
    // Fallback: use direct child divs if column structure missing
    columns = Array.from(element.querySelectorAll(':scope > div'));
  }

  // 3. Prepare table rows (header + columns)
  // If columns are missing, ensure a valid structure
  const cells = [headerRow, columns.length ? columns : ['']];

  // 4. Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
