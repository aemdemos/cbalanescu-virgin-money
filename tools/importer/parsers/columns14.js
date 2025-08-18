/* global WebImporter */
export default function parse(element, { document }) {
  // Find the sl-list container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Find direct child .sl-item elements (columns)
  const items = slList.querySelectorAll(':scope > .sl-item');
  if (!items.length) return;

  // Each .sl-item contains a section (the column block)
  const columns = Array.from(items).map(item => {
    // Find the section.cm-image-block-link inside the item
    const section = item.querySelector('section.cm-image-block-link');
    return section || item;
  });

  // Header row is a single cell, even if there are multiple columns of content
  const rows = [];
  rows.push(['Columns (columns14)']);
  rows.push(columns);

  const table = WebImporter.DOMUtils.createTable(rows, document);

  // The table now correctly has a single header cell followed by one row of N columns
  element.replaceWith(table);
}