/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion30)'];
  // Each <li> is an accordion item
  const items = Array.from(element.querySelectorAll(':scope > li'));
  const rows = [];

  items.forEach((item) => {
    // Title cell: the <a> tag inside <li>, remove any trailing .ec div
    const a = item.querySelector('a');
    let titleCell = null;
    if (a) {
      // Remove extraneous .ec div if present
      const ecDiv = a.querySelector(':scope > .ec');
      if (ecDiv) ecDiv.remove();
      titleCell = a;
    } else {
      titleCell = document.createElement('span');
    }
    // Content cell: the .expandcollapse-content div inside <li>
    let contentCell = null;
    const expandDiv = item.querySelector(':scope > .expandcollapse-content');
    if (expandDiv) {
      // Prefer the rich text content inside
      const richContent = expandDiv.querySelector('.cm-rich-text');
      if (richContent) {
        contentCell = richContent;
      } else {
        contentCell = expandDiv;
      }
    } else {
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });
  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
