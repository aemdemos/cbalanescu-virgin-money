/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main sl-list (the outer one)
  const slList = element.querySelector('.sl-list.has-2-items');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter((el) => el.classList.contains('sl-item'));
  if (slItems.length < 2) return;

  // First column: left side (heading)
  const leftContent = slItems[0].querySelector('.cm-rich-text');

  // Second column: right side (paragraph and awards)
  const rightContent = slItems[1].querySelector('.cm-rich-text');
  // Find nested column-container for awards
  const nestedColumn = slItems[1].querySelector('.column-container');
  let awardsContent = null;
  if (nestedColumn) {
    const nestedSlList = nestedColumn.querySelector('.sl-list.has-1-item');
    if (nestedSlList) {
      const nestedSlItem = nestedSlList.querySelector('.sl-item');
      if (nestedSlItem) {
        awardsContent = nestedSlItem.querySelector('.cm-rich-text');
      }
    }
  }

  // Each cell must be a single element or array of elements, not nested arrays or divs
  // Remove empty paragraphs from rightContent and awardsContent
  function cleanContent(node) {
    if (!node) return null;
    const clone = node.cloneNode(true);
    Array.from(clone.querySelectorAll('p')).forEach(p => {
      if (!p.textContent.trim() && !p.querySelector('img')) p.remove();
    });
    return clone;
  }

  const cleanedRight = cleanContent(rightContent);
  const cleanedAwards = cleanContent(awardsContent);

  // Compose right column cell: paragraph + awards (as flat array of elements)
  const rightCellContent = [];
  if (cleanedRight) rightCellContent.push(...cleanedRight.childNodes);
  if (cleanedAwards) rightCellContent.push(...cleanedAwards.childNodes);

  // Table rows
  const headerRow = ['Columns (columns51)'];
  const columnsRow = [leftContent, rightCellContent];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
