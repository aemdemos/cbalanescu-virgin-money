/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate .sl-item children (columns)
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    columns = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  }

  // Second row: one cell per column, referencing the main content
  const secondRow = columns.map(col => {
    const richText = col.querySelector('.cm-rich-text');
    if (richText) return richText;
    const paragraph = col.querySelector('.cq-dd-paragraph');
    if (paragraph) {
      const sectionLinks = paragraph.querySelector('section.cm-links-related');
      if (sectionLinks) return sectionLinks;
      return paragraph;
    }
    return col;
  });

  // Header row: exactly one cell, but match the number of columns so it can span all columns
  // By placing undefined for remaining columns, DOMUtils will create empty <th> cells, but most block systems treat the first cell as the block name, rest ignored
  // But for semantic accuracy, create one cell and fill the rest with empty string
  const headerRow = ['Columns (columns37)', ...Array(secondRow.length - 1).fill('')];

  const tableData = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
