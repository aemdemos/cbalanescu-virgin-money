/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a .sl-item
  function extractCardContent(slItem) {
    // Find the content panel container
    const contentPanel = slItem.querySelector('.cm-content-panel-container');
    if (!contentPanel) return [null, null];
    const richText = contentPanel.querySelector('.cm-rich-text');
    if (!richText) return [null, null];

    // Find the image (first img in the content)
    const img = richText.querySelector('img');
    let imgRef = null;
    if (img) {
      // Reference the existing image element
      imgRef = img;
    }

    // Build the text cell
    // We'll preserve headings, paragraphs, links, and superscript
    const textCell = document.createElement('div');
    Array.from(richText.children).forEach((child) => {
      // Skip the image (and its parent <p> if that's all it contains)
      if (
        child.tagName === 'P' &&
        child.querySelector('img') &&
        child.childNodes.length === 1
      ) {
        return;
      }
      textCell.appendChild(child.cloneNode(true));
    });

    return [imgRef, textCell];
  }

  // Find all cards
  const slItems = element.querySelectorAll('.sl-item');
  const rows = [];
  // Header row: must match block name exactly
  rows.push(['Cards (cards41)']);

  slItems.forEach((slItem) => {
    const [img, textCell] = extractCardContent(slItem);
    if (img && textCell) {
      rows.push([img, textCell]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
