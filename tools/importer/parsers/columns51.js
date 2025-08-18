/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: one cell only, as per strict requirements
  const headerRow = ['Columns (columns51)'];

  // Find sl-list, which contains the columns
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Each direct child of sl-list is a column cell
  const slItems = Array.from(slList.children);

  // For each column, use the main content block inside it
  const contentRow = slItems.map((item) => {
    // Use the .cm-rich-text if present, else .cm-icon-title, else the item itself
    const richText = item.querySelector(':scope > .cm-rich-text');
    if (richText) return richText;
    const iconTitle = item.querySelector(':scope > section.cm-icon-title');
    if (iconTitle) return iconTitle;
    return item;
  });

  // Table: header row is a single cell, second row has one cell per column
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
