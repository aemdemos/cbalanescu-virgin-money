/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Columns (columns7)'];

  // Find the columns: two .sl-item children
  const slList = element.querySelector('.sl-list.has-feature-right');
  const slItems = slList ? slList.querySelectorAll(':scope > .sl-item') : [];

  // Defensive: ensure we always have two columns (even if one is missing)
  let column1Content = '';
  let column2Content = '';

  if (slItems[0]) {
    // Column 1: image block
    // This block is a section.cm-image > figure > div > img
    // We want to reference the existing <img> element for semantic fidelity
    const img = slItems[0].querySelector('img');
    if (img) {
      column1Content = img;
    }
  }

  if (slItems[1]) {
    // Column 2: rich text block
    // All content inside .cm-rich-text, including headings, paragraphs, CTA
    const richText = slItems[1].querySelector('.cm-rich-text');
    if (richText) {
      column2Content = richText;
    }
  }

  // Compose block table as per example structure
  const cells = [
    headerRow,
    [column1Content, column2Content]
  ];

  // Create and replace table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
