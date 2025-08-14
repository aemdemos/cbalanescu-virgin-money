/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name, exactly matching spec
  const headerRow = ['Hero (hero26)'];

  // Row 2: Background image (none present, so empty string)
  const bgRow = [''];

  // Row 3: Content (title, subheading, CTAs)
  // Find the first child div with class 'cm-rich-text' for main content
  let richText = null;
  const childDivs = Array.from(element.querySelectorAll(':scope > div'));
  for (let div of childDivs) {
    if (div.classList.contains('cm-rich-text')) {
      richText = div;
      break;
    }
  }
  // Fallback: if richText not found, use element itself
  if (!richText) richText = element;

  // Confirm we reference the existing block, not clone
  const contentRow = [richText];

  // Build table
  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
