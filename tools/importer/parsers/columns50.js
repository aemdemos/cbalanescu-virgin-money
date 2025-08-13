/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract columns: the root .column-container contains .sl > .sl-list.has-2-items > .sl-item (2 items)
  const mainSl = element.querySelector('.sl');
  if (!mainSl) return;
  const mainSlList = mainSl.querySelector('.sl-list.has-2-items');
  if (!mainSlList) return;
  const mainItems = mainSlList.querySelectorAll(':scope > .sl-item');
  if (mainItems.length < 2) return;

  // First column: left, usually contains a heading.
  const leftContent = mainItems[0].querySelector('.cm');
  // Second column: right, contains paragraphs and a nested column of award images.
  const rightItem = mainItems[1];

  // Gather all non-empty paragraphs from right column.
  let rightFragments = [];
  const rightRich = rightItem.querySelector('.cm');
  if (rightRich) {
    Array.from(rightRich.children).forEach((child) => {
      if ((child.tagName === 'P' || child.tagName === 'DIV' || child.tagName === 'SPAN') && child.textContent.trim().length > 0) {
        rightFragments.push(child);
      }
    });
  }

  // Find nested column with awards images in right column.
  const nestedColumn = rightItem.querySelector('.column-container');
  if (nestedColumn) {
    const nestedSl = nestedColumn.querySelector('.sl');
    if (nestedSl) {
      const nestedSlList = nestedSl.querySelector('.sl-list.has-1-item');
      if (nestedSlList) {
        const nestedSlItem = nestedSlList.querySelector('.sl-item');
        if (nestedSlItem) {
          const nestedCm = nestedSlItem.querySelector('.cm');
          if (nestedCm) {
            // Gather all images (award badges)
            const imgNodes = Array.from(nestedCm.querySelectorAll('img'));
            if (imgNodes.length > 0) {
              // Place all images into a div container
              const imgDiv = document.createElement('div');
              imgNodes.forEach(img => imgDiv.appendChild(img));
              rightFragments.push(imgDiv);
            }
          }
        }
      }
    }
  }

  // If rightFragments is empty, add a blank paragraph
  if (rightFragments.length === 0) {
    const emptyP = document.createElement('p');
    rightFragments.push(emptyP);
  }

  // Table header must be exactly 'Columns (columns50)'
  const headerRow = ['Columns (columns50)'];
  // Second row
  const contentRow = [leftContent, rightFragments];
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
