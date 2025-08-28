/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion9)'];
  const rows = [headerRow];

  // Find accordion-list
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;
  
  // Each immediate <li> in accordion-list is an item
  const accordionItems = Array.from(accordionList.children).filter(child => child.tagName === 'LI');

  accordionItems.forEach((item) => {
    // Title: the clickable link (usually only one per <li>)
    // Content: the corresponding expandcollapse div
    const titleLink = item.querySelector('a');
    const contentDiv = item.querySelector('div.expandcollapse-content');

    if (titleLink && contentDiv) {
      // Only reference the existing elements from the DOM

      // For the title cell, remove aria attributes and classes just for block cleanliness
      titleLink.removeAttribute('aria-controls');
      titleLink.removeAttribute('aria-expanded');
      titleLink.removeAttribute('target');
      titleLink.removeAttribute('class');

      // Content cell: find main <ol>, but if no <ol>, use the div (handles edge case)
      let contentCell;
      const contentOl = contentDiv.querySelector('ol');
      if (contentOl) {
        contentCell = contentOl;
      } else {
        contentCell = contentDiv;
      }
      rows.push([titleLink, contentCell]);
    }
  });

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
