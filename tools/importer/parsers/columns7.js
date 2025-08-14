/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child .sl-list if present
  function getDirectSlList(el, className) {
    return Array.from(el.children).find(e => e.classList && e.classList.contains('sl-list') && (!className || e.classList.contains(className)));
  }

  // Block header as required
  const headerRow = ['Columns (columns7)'];

  // Identify the top-level sl-list
  const topSlList = getDirectSlList(element, 'has-feature-right');
  if (!topSlList) return;
  const topItems = topSlList.querySelectorAll(':scope > .sl-item');
  if (topItems.length < 2) return;

  // Column 1: image block
  let leftImg = null;
  const leftSection = topItems[0].querySelector('section.cm-image');
  if (leftSection) {
    const figImg = leftSection.querySelector('img');
    if (figImg) leftImg = figImg;
  }

  // Column 2: icon-title sections (all content blocks in right sl-item tree)
  let rightCol = document.createElement('div');
  // Find nested sl-list in the second item
  const nestedContainer = topItems[1].querySelector('.column-container');
  if (nestedContainer) {
    const nestedSl = getDirectSlList(nestedContainer);
    if (nestedSl) {
      // Each sl-item inside may have several sections
      nestedSl.querySelectorAll(':scope > .sl-item').forEach(nestedItem => {
        nestedItem.querySelectorAll(':scope > section.cm-icon-title').forEach(section => {
          rightCol.appendChild(section);
        });
      });
    }
  }

  // Compose final cells: header plus columns row
  const cells = [
    headerRow,
    [leftImg, rightCol]
  ];

  // Replace original element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
