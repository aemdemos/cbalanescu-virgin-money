/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row exactly as specified
  const headerRow = ['Columns (columns37)'];
  
  // Get the main columns from the structure
  // Source HTML: .sl-list > .sl-item (2 items: left column, right column)
  const slList = element.querySelector('.sl-list');
  let leftCell = null;
  let rightCell = null;

  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    if (items.length === 2) {
      // Left: heading (rich text)
      // Grab the .cm-rich-text block inside first .sl-item
      leftCell = items[0].querySelector('.cm-rich-text') || items[0];
      
      // Right: links list section inside second .sl-item
      // Try for .cq-dd-paragraph > section, fallback to the item itself
      const rightSection = items[1].querySelector('.cq-dd-paragraph section') 
        || items[1].querySelector('section') 
        || items[1];
      rightCell = rightSection;
    }
  }

  // Defensive: If no sl-list found, do nothing
  if (!leftCell && !rightCell) return;

  // Compose the table rows: header, then columns
  const rows = [
    headerRow,
    [leftCell, rightCell]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
