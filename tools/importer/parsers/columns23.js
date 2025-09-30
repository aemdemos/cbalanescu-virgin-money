/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children of a node
  function getImmediateChildrenByTag(parent, tag) {
    return Array.from(parent.children).filter(child => child.tagName.toLowerCase() === tag);
  }

  // Find the two column items
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  if (slItems.length < 2) return;

  // --- COLUMN 1 ---
  // Find image section in first column
  let col1Content = [];
  const imgSection = slItems[0].querySelector('.cm-image');
  if (imgSection) {
    // Use the entire section for resilience
    col1Content.push(imgSection);
  }

  // --- COLUMN 2 ---
  // Find rich text section in second column
  let col2Content = [];
  const richSection = slItems[1].querySelector('.cm-rich-text');
  if (richSection) {
    // Use the entire rich text section for resilience
    col2Content.push(richSection);
  }

  // Compose table rows
  const headerRow = ['Columns (columns23)'];
  const columnsRow = [col1Content, col2Content];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
