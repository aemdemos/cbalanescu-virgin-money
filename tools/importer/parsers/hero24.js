/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row exactly as required
  const headerRow = ['Hero (hero24)'];

  // 2. Background image row (none present)
  //   In this HTML there is no image, so cell is empty string
  const bgRow = [''];

  // 3. Content row: must contain all text and links, preserving structure
  // Get the rich-text container that has the heading, paragraph, and link
  // This is the deepest .cm-rich-text block. Find it safely.
  let contentPanel = null;
  // Get all divs inside this element (which itself is a wrapper)
  const innerDivs = element.querySelectorAll(':scope > div');
  for (const div of innerDivs) {
    // Find the rich-text module inside these
    const richText = div.querySelector('.cm-rich-text');
    if (richText) {
      contentPanel = richText;
      break;
    }
  }
  // If not found, fallback to the first child div (defensive, though structure should always contain richText)
  if (!contentPanel && innerDivs.length > 0) {
    contentPanel = innerDivs[0];
  }

  // If nothing found, fallback to empty string as a safeguard
  const contentRow = [contentPanel || ''];

  // 4. Compose table
  const cells = [headerRow, bgRow, contentRow];

  // 5. Create the block using reference to document
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace original element with the block table, per instructions
  element.replaceWith(block);
}
