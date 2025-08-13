/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row exactly as required
  const headerRow = ['Accordion (accordion28)'];

  // Get all .filtered-content sections (each accordion item)
  const accordionItems = element.querySelectorAll('.filtered-content');
  const rows = [headerRow];

  // For each accordion item, extract the required content
  accordionItems.forEach(item => {
    // Title from data-title (always present)
    const title = item.getAttribute('data-title') || '';
    // Reference the whole item as the content cell for resilience
    // (It contains all child structure, headings, links, etc)
    rows.push([
      title,
      item
    ]);
  });

  // Create the table and replace
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
