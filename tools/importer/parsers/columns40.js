/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns40)'];

  // Find the .sl-list column container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // Ensure we have two columns (as in the provided HTML)
  // First column is the image (phone)
  let col1 = null;
  if (items[0]) {
    // Grab the entire section for image so formatting is kept
    // But since only the image is relevant, use the actual img inside
    const img = items[0].querySelector('img');
    if (img) {
      col1 = img;
    } else {
      // If no image, use the entire item
      col1 = items[0];
    }
  }

  // Second column: rich text
  let col2Content = [];
  if (items[1]) {
    const richText = items[1].querySelector('.cm-rich-text');
    if (richText) {
      // Grab h2
      const h2 = richText.querySelector('h2');
      if (h2) col2Content.push(h2);
      // Grab all non-empty paragraphs
      const paragraphs = Array.from(richText.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0);
      col2Content.push(...paragraphs);
      // Grab the app store table
      const appTable = richText.querySelector('.responsive-table table');
      if (appTable) col2Content.push(appTable);
    } else {
      // Fallback to all content in items[1]
      col2Content.push(items[1]);
    }
  }

  // If no content found in the second column, fallback to item
  if (col2Content.length === 0 && items[1]) {
    col2Content = [items[1]];
  }

  // Build the table rows
  const tableRows = [
    headerRow,
    [col1, col2Content]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the element with the block table
  element.replaceWith(block);
}
