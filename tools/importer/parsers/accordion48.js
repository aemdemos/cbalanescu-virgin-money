/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion48)'];

  // Find the root accordion-list
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;
  const mainLi = accordionList.querySelector('li');
  if (!mainLi) return;
  const contentDiv = mainLi.querySelector('.expandcollapse-content');
  if (!contentDiv) return;

  // Get all accordion items (tcs-wrapper divs)
  const wrappers = Array.from(contentDiv.querySelectorAll('.tcs-wrapper'));
  const rows = [];

  wrappers.forEach(wrapper => {
    // Each tcs-wrapper contains one <li>
    const itemLi = wrapper.querySelector('li');
    if (!itemLi) return;
    // Title: get the first <p> OR the first child node that is text or an element
    let titleCell = null;
    let contentCell = null;
    const allChildren = Array.from(itemLi.childNodes);
    // Find the first <p> or text node for the title
    let titleIndex = -1;
    for (let i = 0; i < allChildren.length; i++) {
      const node = allChildren[i];
      if (
        (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      ) {
        titleCell = node;
        titleIndex = i;
        break;
      }
    }
    // If not found, fallback to the entire li
    if (!titleCell) {
      titleCell = itemLi;
      titleIndex = -1;
    }
    // Content: everything AFTER the title
    const contentElements = [];
    for (let i = titleIndex + 1; i < allChildren.length; i++) {
      const node = allChildren[i];
      // Only include elements or non-empty text nodes
      if (
        (node.nodeType === Node.ELEMENT_NODE) ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      ) {
        contentElements.push(node);
      }
    }
    // If there is content, keep as an array (not cloning, referencing!)
    if (contentElements.length === 1) {
      contentCell = contentElements[0];
    } else if (contentElements.length > 1) {
      contentCell = contentElements;
    } else {
      // If no explicit content, provide an empty div for structure
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });

  // Build the table for accordion block
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
