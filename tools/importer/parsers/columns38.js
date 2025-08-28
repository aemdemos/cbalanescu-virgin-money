/* global WebImporter */
export default function parse(element, { document }) {
  // Find main columns block from .sl-list > .sl-item
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length < 2) return;

  // Column 1: image
  const col1Item = slItems[0];
  // Try to extract the main image element
  let col1Content = [];
  const img = col1Item.querySelector('img');
  if (img) col1Content.push(img);

  // Column 2: rich text
  const col2Item = slItems[1];
  // We want to preserve all rich text, heading, paragraphs, tables, etc
  const richText = col2Item.querySelector('.cm-rich-text');
  let col2Content = [];
  if (richText) {
    // Get all children of the richText block, preserving layout
    // Avoid empty paragraphs
    Array.from(richText.childNodes).forEach(child => {
      // skip whitespace text nodes and empty paragraphs
      if (child.nodeType === 3 && !child.textContent.trim()) return;
      if (child.nodeType === 1 && child.tagName === 'P' && !child.textContent.trim()) return;
      col2Content.push(child);
    });
  } else {
    // Fallback: use all content from col2Item
    Array.from(col2Item.childNodes).forEach(child => {
      if (child.nodeType === 3 && !child.textContent.trim()) return;
      col2Content.push(child);
    });
  }

  // Table header row - matches exactly
  const headerRow = ['Columns (columns38)'];
  // Columns row: each cell is an array of elements
  const row = [col1Content, col2Content];
  const cells = [headerRow, row];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
