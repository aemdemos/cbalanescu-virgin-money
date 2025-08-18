/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER: exact match to example
  const headerRow = ['Columns (columns7)'];

  // Find the outer sl-list (with has-feature-right for two columns)
  const outerList = element.querySelector('.sl-list.has-feature-right') || element.querySelector('.sl-list');
  if (!outerList) return;
  const outerItems = Array.from(outerList.children);

  // --- COLUMN 1 ---
  // Find the left image inside the first .sl-item
  let leftCell = null;
  if (outerItems[0]) {
    // Find the first img inside this column
    const img = outerItems[0].querySelector('img');
    if (img) {
      leftCell = img;
    } else {
      leftCell = outerItems[0]; // fallback to referencing the whole column
    }
  }
  
  // --- COLUMN 2 ---
  // The second .sl-item contains a .column-container -> .sl -> .sl-list.has-2-items
  let rightCell = null;
  if (outerItems[1]) {
    const innerList = outerItems[1].querySelector('.sl-list.has-2-items');
    if (innerList) {
      const innerItems = Array.from(innerList.children);
      // Prepare two sub-columns as in the visual example
      // Each inner sl-item contains several cm-icon-title sections
      // We want to build two columns, each cell contains the respective icon-title sections
      let col1Blocks = [];
      let col2Blocks = [];
      if (innerItems[0]) {
        // Left column: all cm-icon-title sections under this sl-item
        const col1Sections = innerItems[0].querySelectorAll('section.cm-icon-title');
        col1Blocks = Array.from(col1Sections);
      }
      if (innerItems[1]) {
        const col2Sections = innerItems[1].querySelectorAll('section.cm-icon-title');
        col2Blocks = Array.from(col2Sections);
      }
      // Compose inner columns into a container (simulate columns visually)
      // We'll use a <div style="display:flex"> to present two columns side by side
      const columnsWrapper = document.createElement('div');
      columnsWrapper.style.display = 'flex';
      columnsWrapper.style.gap = '2em'; // Optional visual spacing
      const leftColDiv = document.createElement('div');
      col1Blocks.forEach(b => leftColDiv.appendChild(b));
      const rightColDiv = document.createElement('div');
      col2Blocks.forEach(b => rightColDiv.appendChild(b));
      columnsWrapper.appendChild(leftColDiv);
      columnsWrapper.appendChild(rightColDiv);
      rightCell = columnsWrapper;
    } else {
      // Fallback: reference the entire item if no innerList found
      rightCell = outerItems[1];
    }
  }

  // Compose the block table: header and two columns
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the block table using WebImporter
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
