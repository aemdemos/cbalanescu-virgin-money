/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block content
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  // There should be two columns, left is image, right is rich content
  if (slItems.length < 2) return;

  // First column: Image block
  let leftContent = null;
  const img = slItems[0].querySelector('img');
  if (img) {
    leftContent = img;
  } else {
    // fallback: the whole image section if no img
    leftContent = slItems[0];
  }

  // Second column: Right content (headings, text, app store links)
  let rightContent;
  const rich = slItems[1].querySelector('.cm-rich-text');
  if (rich) {
    rightContent = rich;
  } else {
    rightContent = slItems[1];
  }

  // Build the columns block table
  const cells = [
    ['Columns (columns35)'],
    [leftContent, rightContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
