/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container which holds heading, subheading, CTA
  let contentContainer = element.querySelector('.cm-rich-text, .module__content');
  if (!contentContainer) {
    // fallback: look for a div containing at least a heading
    const divs = element.querySelectorAll(':scope > div');
    for (const div of divs) {
      if (div.querySelector('h1, h2, h3, h4, h5, h6')) {
        contentContainer = div;
        break;
      }
    }
  }
  // If still not found, fallback to the element itself
  if (!contentContainer) {
    contentContainer = element;
  }
  // Prepare table rows
  const headerRow = ['Hero (hero24)'];
  // No background image, leave blank
  const bgRow = [''];
  // Third row: content
  const contentRow = [contentContainer];

  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
