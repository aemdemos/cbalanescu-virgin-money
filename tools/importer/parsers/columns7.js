/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns7)'];

  // Find the main sl-list with the image and the inner content
  const mainSlList = element.querySelector('.sl-list.has-2-items.has-feature-right');
  if (!mainSlList) return;
  const mainSlItems = Array.from(mainSlList.querySelectorAll(':scope > .sl-item'));
  if (mainSlItems.length !== 2) return;

  // First column: find the image element (should be inside figure > div > img)
  let firstColContent = null;
  const firstImg = mainSlItems[0].querySelector('img');
  if (firstImg) {
    // Reference image's parent figure if available, else just the image
    const figure = firstImg.closest('figure');
    firstColContent = figure ? figure : firstImg;
  }

  // Second column: find the nested column-container
  // The second mainSlItem contains a .column-container > .sl > .sl-list.has-2-items
  const secondColContainer = mainSlItems[1].querySelector('.column-container');
  if (!secondColContainer) return;
  const secondColSlList = secondColContainer.querySelector('.sl-list.has-2-items');
  if (!secondColSlList) return;
  const secondColSlItems = Array.from(secondColSlList.querySelectorAll(':scope > .sl-item'));
  // There should be two inner columns
  if (!secondColSlItems.length) return;

  // For each inner column, gather all the icon-title sections as elements, retaining structure
  function extractIconTitleSections(slItem) {
    // Each icon-title section should keep the image, heading, and paragraph
    const sections = Array.from(slItem.querySelectorAll('section.cm-icon-title'));
    return sections.map(section => section);
  }
  const leftSections = extractIconTitleSections(secondColSlItems[0]);
  const rightSections = extractIconTitleSections(secondColSlItems[1]);

  // Create two arrays for the second row: one for each column
  // Each cell is an array of its sections
  const cells = [
    headerRow,
    [firstColContent, [...leftSections, ...rightSections]]
  ];

  // Build the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with block
  element.replaceWith(block);
}
