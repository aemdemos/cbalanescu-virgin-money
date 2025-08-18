/* global WebImporter */
export default function parse(element, { document }) {
  // Table header should exactly match the example: 'Columns (columns3)'
  const headerRow = ['Columns (columns3)'];

  // Find the columns source: .sl-list > .sl-item (2 children)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // Column 1: image block (section.cm-image)
  const imageSection = slItems[0].querySelector('section.cm-image') || slItems[0];
  // Column 2: text block (div.cm-rich-text)
  const richTextDiv = slItems[1].querySelector('div.cm-rich-text') || slItems[1];

  // Reference the full blocks in each column for resilience
  const row = [imageSection, richTextDiv];

  // Build cells array for the block table
  const cells = [headerRow, row];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}