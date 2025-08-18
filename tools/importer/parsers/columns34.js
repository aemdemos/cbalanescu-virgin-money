/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: exactly as per instructions
  const headerRow = ['Columns (columns34)'];

  // Locate the columns inside the block (should be 2)
  const slList = element.querySelector('.column-container .sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  if (slItems.length < 2) return;

  // --- LEFT COLUMN ---
  // The left column contains the figure for the phone image
  // We want the figure element (with its child img)
  let leftCell;
  const fig = slItems[0].querySelector('figure');
  if (fig) {
    leftCell = fig;
  } else {
    leftCell = slItems[0];
  }

  // --- RIGHT COLUMN ---
  // The right column contains rich text and app buttons table
  // We'll gather all content from the .cm-rich-text div
  const richText = slItems[1].querySelector('.cm-rich-text');
  let rightContent = [];
  if (richText) {
    // Gather headings, paragraphs, and the table (if present)
    const nodes = Array.from(richText.childNodes).filter(node => {
      // Keep elements (h2, p, div.table, etc.), exclude empty text nodes
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
    nodes.forEach(node => {
      rightContent.push(node);
    });
  } else {
    // Fallback: use the entire right column item
    rightContent = [slItems[1]];
  }

  // Compose the cells structure
  const cells = [
    headerRow,
    [leftCell, rightContent]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original block element with the table
  element.replaceWith(table);
}
