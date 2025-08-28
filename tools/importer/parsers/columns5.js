/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the spec
  const headerRow = ['Columns (columns5)'];

  // Find all immediate .sl-item children that represent columns
  const itemNodes = Array.from(element.querySelectorAll('.sl-list > .sl-item'));
  // Each .sl-item contains one column's content
  // Reference the actual .cm-rich-text (content module) inside each sl-item, or fallback to .sl-item
  const columns = itemNodes.map(item => {
    const rich = item.querySelector('.cm-rich-text, .cm');
    // If no rich content, fallback to the sl-item itself
    return rich || item;
  });

  // Build the table: header row, then one content row with the columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columns
  ], document);

  element.replaceWith(table);
}
