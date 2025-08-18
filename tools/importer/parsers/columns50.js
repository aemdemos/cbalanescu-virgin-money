/* global WebImporter */
export default function parse(element, { document }) {
  // Block header from example
  const headerRow = ['Columns (columns50)'];

  // Find the top-level .sl-list with two items: our two columns
  const slList = element.querySelector('.sl-list.has-2-items');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter(child => child.matches('.sl-item'));
  if (slItems.length !== 2) return;

  // LEFT COLUMN: Only the heading (inside .cm.cm-rich-text)
  const leftItem = slItems[0];
  const leftRichText = leftItem.querySelector('.cm.cm-rich-text');
  // Use the existing heading element reference if present
  let leftColumnContent = null;
  if (leftRichText) {
    // Find first heading element (h1-h6)
    const heading = leftRichText.querySelector('h1, h2, h3, h4, h5, h6');
    leftColumnContent = heading || leftRichText; // fallback: use the whole block
  }

  // RIGHT COLUMN: The text, then all award images (including all paragraphs in rich text)
  const rightItem = slItems[1];
  let rightColumnElements = [];

  // Add all paragraphs from rich text
  const rightRichText = rightItem.querySelector('.cm.cm-rich-text');
  if (rightRichText) {
    Array.from(rightRichText.children).forEach(child => {
      if (child.tagName === 'P') rightColumnElements.push(child);
    });
  }

  // Add award images block: locate nested column-container > .sl > .sl-list > .sl-item > .cm.cm-rich-text
  const nestedColumn = rightItem.querySelector('.column-container');
  if (nestedColumn) {
    const awardRichText = nestedColumn.querySelector('.cm.cm-rich-text');
    if (awardRichText) {
      Array.from(awardRichText.children).forEach(child => {
        rightColumnElements.push(child);
      });
    }
  }

  // If no left or right content, do not proceed
  if (!leftColumnContent || rightColumnElements.length === 0) return;

  // Compose the table for the block
  const tableRows = [
    headerRow,
    [leftColumnContent, rightColumnElements]
  ];

  // Create the block table, replacing original element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
