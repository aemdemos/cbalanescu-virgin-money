/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match example
  const headerRow = ['Hero (hero24)'];

  // Find the .cm-content-panel-container block as it has the background styling
  // For this HTML, the background is just a color, not an image, so the Background Image row is blank
  const backgroundRow = [''];

  // Find the rich text content div (contains heading, paragraph, CTA)
  // Reference the actual element, don't clone, to preserve formatting and structure
  let richTextDiv = null;
  const richTextCandidates = element.querySelectorAll('.cm-rich-text');
  if (richTextCandidates.length > 0) {
    richTextDiv = richTextCandidates[0];
  } else {
    // fallback for edge cases: use the first div inside the panel-container
    const container = element.querySelector('.cm-content-panel-container');
    if (container) {
      const firstDiv = container.querySelector('div');
      if (firstDiv) richTextDiv = firstDiv;
    } else {
      // fallback to first div in element
      const firstDiv = element.querySelector('div');
      if (firstDiv) richTextDiv = firstDiv;
    }
  }

  // If we couldn't find anything, use an empty string
  const contentRow = [richTextDiv || ''];

  // Build table rows
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  // Create the table using WebImporter helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table block
  element.replaceWith(block);
}
