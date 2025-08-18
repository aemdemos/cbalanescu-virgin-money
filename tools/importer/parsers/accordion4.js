/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by the block spec
  const rows = [['Accordion (accordion4)']];

  // Find accordion items
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;
  const accordionItem = accordionList.querySelector('li');
  if (!accordionItem) return;

  // Extract the title
  const titleAnchor = accordionItem.querySelector('a');
  let title = '';
  if (titleAnchor) {
    // Remove child divs (icons etc.)
    titleAnchor.querySelectorAll('div,svg').forEach(d => d.remove());
    title = titleAnchor.textContent.trim();
  }

  // Extract the content blocks (all tcs-wrapper inside expandcollapse-content > ol)
  const expandDiv = accordionItem.querySelector('div.expandcollapse-content');
  let wrappers = [];
  if (expandDiv) {
    const ol = expandDiv.querySelector('ol');
    if (ol) {
      wrappers = Array.from(ol.querySelectorAll(':scope > .tcs-wrapper'));
    }
  }
  // For each tcs-wrapper, extract its content as a cell
  wrappers.forEach(wrapper => {
    // For each wrapper, get the <p> (or all children)
    let contentEls = [];
    // Some wrappers have multiple <p> or other nodes
    contentEls = Array.from(wrapper.childNodes).filter(node => {
      // Only keep elements and non-empty text
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
    // If the first child is an <li>, use its children
    if (contentEls.length === 1 && contentEls[0].tagName === 'LI') {
      contentEls = Array.from(contentEls[0].childNodes).filter(node => {
        return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
      });
    }
    // Place in table row: title on left, content on right
    rows.push([title, contentEls]);
  });

  // Create and replace with the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
