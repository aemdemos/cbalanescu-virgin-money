/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to get immediate children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the .column-container as root of block
  const columnContainer = getDirectChildByClass(element, 'column-container') || element;
  // Find .sl-list inside .column-container
  const slList = columnContainer.querySelector('.sl-list');
  // Get each column (.sl-item)
  let slItems = [];
  if (slList) {
    slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  }
  // Fallback if structure changes
  if (slItems.length === 0) {
    slItems = Array.from(columnContainer.querySelectorAll('.sl-item'));
  }
  // There should be two columns
  // First column: image
  // Second column: text content and app badges

  // Extract left column (image)
  let leftContent = null;
  if (slItems[0]) {
    // Find figure or section.cm-image inside first column
    const fig = slItems[0].querySelector('figure, section.cm-image, section.cm.cm-image');
    leftContent = fig ? fig : slItems[0];
  } else {
    leftContent = document.createElement('div'); // empty fallback
  }

  // Extract right column (rich text, heading, description, app badges)
  let rightContent = null;
  if (slItems[1]) {
    // Look for the main rich text container
    const rich = slItems[1].querySelector('.cm-rich-text, .cm.cm-rich-text, .module__content, .l-full-width');
    rightContent = rich ? rich : slItems[1];
  } else {
    rightContent = document.createElement('div'); // empty fallback
  }

  // Table header from example
  const headerRow = ['Columns (columns34)'];
  // Block table row with both columns
  const columnsRow = [leftContent, rightContent];

  // Compose table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
