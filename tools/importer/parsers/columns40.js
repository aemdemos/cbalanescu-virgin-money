/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as required
  const headerRow = ['Columns (columns40)'];

  // Find the two sl-items for columns
  const slList = element.querySelector('.sl-list');
  const slItems = slList ? slList.querySelectorAll(':scope > .sl-item') : [];

  // Defensive: ensure we have 2 items, else default to empty cells
  let leftCell = '';
  let rightCell = '';

  if (slItems.length === 2) {
    // LEFT CELL: first .sl-item, expected to contain the image
    const leftItem = slItems[0];
    // Find the image (preferably the one shown on desktop, but fallback to any img)
    let img = leftItem.querySelector('.hide-on-mobile img');
    if (!img) img = leftItem.querySelector('img');
    leftCell = img || leftItem;

    // RIGHT CELL: second .sl-item, expected to contain rich text and download buttons
    const rightItem = slItems[1];
    const cmRichText = rightItem.querySelector('.cm-rich-text');
    let rightContent = [];
    if (cmRichText) {
      // Heading
      const heading = cmRichText.querySelector('h2');
      if (heading) rightContent.push(heading);
      // Paragraphs (non-empty)
      const paragraphs = cmRichText.querySelectorAll('p');
      paragraphs.forEach(p => {
        // Only add if there is significant text (not just whitespace or &nbsp;)
        if (p.textContent.replace(/\u00A0/g, '').trim().length > 0) rightContent.push(p);
      });
      // Table of app store buttons (icons)
      const table = cmRichText.querySelector('.responsive-table table');
      if (table) rightContent.push(table);
    } else {
      // Fallback: include all rightItem content
      rightContent.push(rightItem);
    }
    rightCell = rightContent.length === 1 ? rightContent[0] : rightContent;
  }

  // Compose columns row with exactly two columns as required by the block
  const columnsRow = [leftCell, rightCell];

  // Compose final table array
  const tableArray = [headerRow, columnsRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  // Replace original element with block table
  element.replaceWith(block);
}
