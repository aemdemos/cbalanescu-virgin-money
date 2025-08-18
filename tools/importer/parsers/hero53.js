/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the example exactly
  const headerRow = ['Hero (hero53)'];
  // No background image present, so second row is empty string
  const bgRow = [''];

  // Flexible content extraction: gather all relevant content for the third row
  // We want to include all headings, paragraphs, and CTAs within the block
  // The structure is: element > (.cm-rich-text) > [h2, p (with a link)]
  let contentFragments = [];
  // Search for the inner rich text container
  const richText = element.querySelector('.cm-rich-text');
  if (richText) {
    // Include each direct child of the rich text container
    // This will catch headings, paragraphs, etc., in correct order
    contentFragments = Array.from(richText.children);
  } else {
    // If not found, fallback to all children of the block
    contentFragments = Array.from(element.children);
  }
  // If still empty, fallback to entire element
  if (contentFragments.length === 0) {
    contentFragments = [element];
  }
  const contentRow = [contentFragments];

  // Compose block table: 1 column, 3 rows
  const cells = [headerRow, bgRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
