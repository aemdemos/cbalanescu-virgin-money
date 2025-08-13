/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Matches exactly as per instructions
  const headerRow = ['Hero (hero52)'];

  // Background image row: This HTML does not have any image/background asset in the DOM, so leave blank
  const imageRow = [''];

  // Content row: Find the main content block (usually .cm-rich-text)
  let contentBlock = null;
  const directChildren = Array.from(element.querySelectorAll(':scope > div'));
  contentBlock = directChildren.find(child => child.classList.contains('cm-rich-text'));
  // If not found, fallback to using the first child, or the element itself if no children
  if (!contentBlock) {
    if (directChildren.length > 0) {
      contentBlock = directChildren[0];
    } else {
      contentBlock = element;
    }
  }

  // Compose the cells array
  const cells = [
    headerRow,
    imageRow,
    [contentBlock]
  ];

  // Create the table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element in the DOM
  element.replaceWith(blockTable);
}
