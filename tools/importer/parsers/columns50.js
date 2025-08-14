/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure the header matches exactly as per the requirement
  const headerRow = ['Columns (columns50)'];

  // The main structure is a two-column layout: left (heading), right (text + awards)
  // From the HTML: .column-container > .sl > .sl-list.has-2-items > .sl-item (x2)
  const slList = element.querySelector('.sl-list.has-2-items');
  let leftColEl = null;
  let rightColEl = null;

  if (slList) {
    const slItems = slList.querySelectorAll(':scope > .sl-item');
    // Defensive: ensure we have 2 columns
    if (slItems.length >= 2) {
      leftColEl = slItems[0];
      rightColEl = slItems[1];
    }
  }

  // LEFT COLUMN: Grab the heading (should be an h3 inside .cm)
  let leftContent = null;
  if (leftColEl) {
    const heading = leftColEl.querySelector('h3');
    leftContent = heading ? heading : leftColEl;
  }

  // RIGHT COLUMN: grab relevant paragraphs and images
  let rightContentEls = [];
  if (rightColEl) {
    // Get all paragraph elements (skip empty ones)
    const paras = Array.from(rightColEl.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0);
    paras.forEach(p => rightContentEls.push(p));

    // Now find the nested .column-container for awards
    const nestedContainer = rightColEl.querySelector(':scope > .column-container');
    if (nestedContainer) {
      // Find all images inside
      const awardImgs = nestedContainer.querySelectorAll('img');
      if (awardImgs.length > 0) {
        // Group all award images inside a div for layout
        const imgGroupDiv = document.createElement('div');
        awardImgs.forEach(img => imgGroupDiv.appendChild(img));
        rightContentEls.push(imgGroupDiv);
      }
    }
  }
  // Defensive: If right column is completely empty, include an empty string
  if (rightContentEls.length === 0) {
    rightContentEls.push('');
  }

  // Compose the table: header row, then columns row
  const cells = [
    headerRow,
    [leftContent, rightContentEls]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
