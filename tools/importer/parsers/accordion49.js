/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion49)'];

  // Find the accordion content
  // The structure is: <ul class="accordion-list"> <li> <a>...</a> <div>...</div> </li> </ul>
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;

  // There is a single <li> in this accordion (for this HTML)
  const li = accordionList.querySelector(':scope > li');
  if (!li) return;

  // Get the title anchor for the accordion
  const titleAnchor = li.querySelector(':scope > a');
  let titleCell;
  if (titleAnchor) {
    const ecDiv = titleAnchor.querySelector('.ec');
    if (ecDiv) ecDiv.remove();
    // Remove interaction-related attributes (optional)
    titleAnchor.removeAttribute('aria-controls');
    titleAnchor.removeAttribute('aria-expanded');
    titleAnchor.removeAttribute('class');
    titleAnchor.removeAttribute('target');
    titleCell = titleAnchor;
  } else {
    titleCell = document.createTextNode('');
  }

  // Find the content div for the accordion
  const contentDiv = li.querySelector(':scope > div.expandcollapse-content');
  let contentCell;
  if (contentDiv) {
    // Look for the <ol>
    const ol = contentDiv.querySelector('ol');
    if (ol) {
      // The original HTML wraps each <li> inside a <div class="tcs-wrapper">
      // We want to preserve the <li> elements (and their contents) as-is inside the content cell, keeping their structure and formatting
      // We'll extract all <li> in the same order
      const liWrappers = Array.from(ol.querySelectorAll(':scope > .tcs-wrapper'));
      const liElements = liWrappers.map(wrapper => {
        const itemLi = wrapper.querySelector('li');
        return itemLi ? itemLi : null;
      }).filter(Boolean);
      if (liElements.length > 0) {
        contentCell = liElements;
      } else {
        contentCell = [ol];
      }
    } else {
      // Fallback: just include the contentDiv
      contentCell = [contentDiv];
    }
  } else {
    contentCell = document.createTextNode('');
  }

  // Build table
  const rows = [headerRow, [titleCell, contentCell]];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
