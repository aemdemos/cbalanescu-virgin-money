/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matching the block name, exactly as in the example
  const headerRow = ['Columns (columns33)'];

  // 2. Extract the two main column contents from the HTML
  //    .sl-list contains .sl-item (each is a column)
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
    columns = slItems.map(item => {
      // Find the rich text content for each column
      const content = item.querySelector('.cm-rich-text');
      // If the content exists, use it
      if (content) return content;
      // Fallback: use all content from item
      return item;
    });
  } else {
    // Fallback: treat the whole element as a single cell
    columns = [element];
  }

  // 3. Compose the table rows
  const tableRows = [
    headerRow,
    columns
  ];

  // 4. Create block table and replace original element
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
