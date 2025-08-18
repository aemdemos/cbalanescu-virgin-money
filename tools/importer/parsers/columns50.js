/* global WebImporter */
export default function parse(element, { document }) {
  // Component/block name
  const headerRow = ['Columns (columns50)'];

  // Find the structure: top-level .sl-list with 2 .sl-item children
  const slList = element.querySelector('.sl-list.has-2-items');
  let leftColContent = [];
  let rightColContent = [];

  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    // LEFT COLUMN (first .sl-item)
    if (items[0]) {
      // Find rich text (heading)
      const leftRich = items[0].querySelector('.cm-rich-text');
      if (leftRich) leftColContent.push(leftRich);
    }

    // RIGHT COLUMN (second .sl-item)
    if (items[1]) {
      // Find rich text paragraphs
      const rightRich = items[1].querySelector('.cm-rich-text');
      if (rightRich) rightColContent.push(rightRich);

      // Find the inner column-container for awards images
      const awardsContainer = items[1].querySelector('.column-container');
      if (awardsContainer) {
        // This container may contain .sl > .sl-list.has-1-item > .sl-item > .cm-rich-text
        const awardsList = awardsContainer.querySelectorAll('.sl-list.has-1-item > .sl-item > .cm-rich-text');
        awardsList.forEach(awardsRich => {
          rightColContent.push(awardsRich);
        });
      }
    }
  }

  // Safety: fallback to original if leftColContent or rightColContent is empty
  if (leftColContent.length === 0) leftColContent.push(document.createTextNode(''));
  if (rightColContent.length === 0) rightColContent.push(document.createTextNode(''));

  // Create one row with the two columns
  const columnsRow = [leftColContent, rightColContent];

  // Build table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
