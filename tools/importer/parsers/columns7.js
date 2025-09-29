/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Columns (columns7)'];

  // Defensive: get the two main column items
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length < 2) return;

  // First column: image
  let imageSection = slItems[0].querySelector('section.cm-image');
  let imageContent = imageSection ? imageSection : slItems[0];

  // Second column: rich text
  let richTextSection = slItems[1].querySelector('.cm-rich-text');
  let richTextContent = richTextSection ? richTextSection : slItems[1];

  // Second row: two columns, image and text
  const secondRow = [imageContent, richTextContent];

  // Build table
  const cells = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
