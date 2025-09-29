/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns36)'];

  // Defensive: find the main columns container
  // The structure is: .column-container > .sl > .sl-list > .sl-item (x2)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // Defensive: check we have at least 2 columns
  if (slItems.length < 2) return;

  // First column: rich text content
  let col1Content;
  const richText = slItems[0].querySelector('.cm-rich-text');
  if (richText) {
    col1Content = richText;
  } else {
    // fallback: use the whole first item
    col1Content = slItems[0];
  }

  // Second column: image content
  let col2Content;
  const imgSection = slItems[1].querySelector('img');
  if (imgSection) {
    col2Content = imgSection.closest('figure') || imgSection;
  } else {
    // fallback: use the whole second item
    col2Content = slItems[1];
  }

  // Build the table rows
  const cells = [
    headerRow,
    [col1Content, col2Content],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
