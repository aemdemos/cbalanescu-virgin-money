/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns42)'];

  // Defensive: Find the two main column containers (sl-item)
  const slItems = Array.from(element.querySelectorAll(':scope .sl-list > .sl-item'));

  // Each sl-item is a column, each containing two sections (features)
  // We'll create two columns, each with two stacked features
  const columns = slItems.map((slItem) => {
    // Get all sections in this column
    const sections = Array.from(slItem.querySelectorAll(':scope > section'));
    // For each section, collect the header (icon + title) and the content
    return sections.map((section) => {
      // Defensive: Get header and content
      const headerDiv = section.querySelector(':scope > .header');
      const contentDiv = section.querySelector(':scope > .content');
      // Compose a wrapper for each feature
      const featureWrapper = document.createElement('div');
      if (headerDiv) featureWrapper.appendChild(headerDiv);
      if (contentDiv) featureWrapper.appendChild(contentDiv);
      return featureWrapper;
    });
  });

  // Now, columns is an array of arrays: [ [feature1, feature2], [feature3, feature4] ]
  // For layout, stack the features vertically in each column
  // Each cell in the row is a column containing its features
  const row = columns.map((features) => features);

  // Build the table data
  const tableData = [headerRow, row];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
