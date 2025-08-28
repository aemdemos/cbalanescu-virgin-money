/* global WebImporter */
export default function parse(element, { document }) {
  // Find all column blocks in the source
  const slList = element.querySelector('.column-container .sl .sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter(e => e.classList.contains('sl-item'));

  // For each column, gather all rich text and images
  const columnsContent = slItems.map(slItem => {
    const richTexts = Array.from(slItem.querySelectorAll('.cm-rich-text'));
    const imgs = Array.from(slItem.querySelectorAll('img'));
    const content = [];
    richTexts.forEach(rt => content.push(rt));
    imgs.forEach(img => content.push(img));
    if (content.length === 0) content.push(slItem);
    return content.length === 1 ? content[0] : content;
  });

  // Create a header row with one cell only, regardless of column count
  const headerRow = ['Columns (columns29)'];
  // All columns go in a single row array
  const cells = [headerRow, columnsContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // After table creation, set the header row th to span all columns
  const headerTr = table.querySelector('tr');
  if (headerTr && headerTr.children.length === 1 && columnsContent.length > 1) {
    headerTr.children[0].setAttribute('colspan', columnsContent.length);
  }
  element.replaceWith(table);
}
