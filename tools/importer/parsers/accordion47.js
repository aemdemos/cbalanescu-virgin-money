/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Accordion (accordion47)'];

  // Find all accordion items (li elements)
  const items = Array.from(element.querySelectorAll('ul.accordion-list > li'));

  // Build table rows: each row = [title cell, content cell]
  const rows = items.map(li => {
    // Title cell: get the anchor text without the .ec div
    const a = li.querySelector('a.accordion-item');
    // Remove the .ec div from the anchor (if present)
    const ecDiv = a.querySelector('.ec');
    if (ecDiv) ecDiv.remove();
    // Compose the title: preserve HTML structure inside the anchor except the ec div
    // If anchor contains other formatting (like <strong> etc), preserve it
    let titleCell = a;

    // Content cell: get the expandcollapse-content div
    const contentDiv = li.querySelector('.expandcollapse-content');
    // Find the main content block inside the content div
    // Usually this is a div.cm-rich-text or .module__content
    let contentArr = [];
    Array.from(contentDiv.children).forEach(child => {
      // Only include actual content elements, not empty wrappers
      if (child.classList.contains('cm-rich-text') || child.classList.contains('module__content') || child.tagName === 'UL' || child.tagName === 'P') {
        // For rich-text/module__content, include all children (paragraphs, lists, etc)
        if (child.children.length > 0) {
          contentArr.push(...Array.from(child.children));
        } else {
          contentArr.push(child);
        }
      } else if (child.tagName === 'P' || child.tagName === 'UL'|| child.tagName === 'A') {
        contentArr.push(child);
      }
    });
    // Fallback: if nothing added, include everything except aria/empty wrappers
    if (contentArr.length === 0) {
      contentArr = Array.from(contentDiv.children);
    }
    // Remove any .ec or visually irrelevant elements
    contentArr = contentArr.filter(el => !(el.classList && el.classList.contains('ec')));
    // If only one element, use it directly, else use the array
    const contentCell = contentArr.length === 1 ? contentArr[0] : contentArr;

    return [titleCell, contentCell];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace element with block
  element.replaceWith(block);
}
