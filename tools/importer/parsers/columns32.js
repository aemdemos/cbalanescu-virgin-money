/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if element exists
  if (!element) return;

  // 1. Table header row
  const headerRow = ['Columns (columns32)'];

  // 2. Find the two main columns in the source HTML
  // The structure is:
  // <div class="column-container">
  //   <div class="sl">
  //     <div class="sl-list has-2-items">
  //       <div class="sl-item">...</div>
  //       <div class="sl-item">...</div>
  //     </div>
  //   </div>
  // </div>

  // Get the sl-list (the row of columns)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter((child) => child.classList.contains('sl-item'));

  // Defensive: Only proceed if we have at least 2 columns
  if (slItems.length < 2) return;

  // Column 1: The left column (icon)
  let col1Content = null;
  const col1Panel = slItems[0].querySelector('.cm-content-panel-container');
  if (col1Panel) {
    // Use the whole panel as the cell content (includes the icon)
    col1Content = col1Panel;
  } else {
    // Fallback: Use the sl-item itself
    col1Content = slItems[0];
  }

  // Column 2: The right column (heading, text, CTA)
  let col2Content = null;
  const col2RichText = slItems[1].querySelector('.cm-rich-text');
  if (col2RichText) {
    col2Content = col2RichText;
  } else {
    // Fallback: Use the sl-item itself
    col2Content = slItems[1];
  }

  // 3. Build the table rows
  const tableRows = [
    headerRow,
    [col1Content, col2Content],
  ];

  // 4. Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // 5. Replace the original element with the block table
  element.replaceWith(blockTable);
}
