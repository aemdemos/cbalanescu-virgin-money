/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards21)'];
  const rows = [];

  // Get all card elements
  const items = element.querySelectorAll('.sl-list > .sl-item');
  items.forEach((item) => {
    // Each card is structured as: section > a
    const link = item.querySelector('a');
    if (!link) return; // handle missing link gracefully
    // Get the image (must be referenced directly)
    const img = link.querySelector('img');
    // Get the heading (h2), if present
    const title = link.querySelector('h2');
    // Create a wrapper for text content
    const textWrapper = document.createElement('div');
    if (title) {
      textWrapper.appendChild(title);
    }
    // The example does not include description or CTA, so only title
    // Add the row only if image and title are present
    if (img && title) {
      rows.push([img, textWrapper]);
    }
  });
  // If no cards found, do nothing
  if (rows.length === 0) return;

  const tableArr = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
