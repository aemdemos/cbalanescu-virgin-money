/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct children matching selector
  const getDirectChildren = (el, selector) => Array.from(el.children).filter(child => child.matches(selector));

  // 1. Header row
  const headerRow = ['Columns (columns15)'];

  // 2. Get the two main columns from the top-level .sl-list
  // The first .sl-list is the outermost one
  const slList = element.querySelector('.sl-list.has-2-items.has-feature-right');
  if (!slList) return;
  const slItems = getDirectChildren(slList, '.sl-item');
  if (slItems.length !== 2) return;

  // Left column: image
  let leftColContent = [];
  const leftSection = slItems[0].querySelector('section.cm-image');
  if (leftSection) {
    const img = leftSection.querySelector('img');
    if (img) leftColContent.push(img);
  }

  // Right column: nested columns
  let rightColContent = [];
  const rightContainer = slItems[1].querySelector('.column-container');
  if (rightContainer) {
    const nestedSlList = rightContainer.querySelector('.sl-list.has-2-items');
    if (nestedSlList) {
      const nestedSlItems = getDirectChildren(nestedSlList, '.sl-item');
      // Each nested sl-item contains multiple cm-icon-title sections
      nestedSlItems.forEach(nestedItem => {
        const iconSections = nestedItem.querySelectorAll('section.cm-icon-title');
        iconSections.forEach(section => {
          // Compose each icon-title as a block
          const headerDiv = section.querySelector('.header');
          const contentDiv = section.querySelector('.content');
          let sectionContent = [];
          if (headerDiv) sectionContent.push(headerDiv);
          if (contentDiv) sectionContent.push(contentDiv);
          // Wrap each section in a div for separation
          if (sectionContent.length) {
            const wrapper = document.createElement('div');
            sectionContent.forEach(e => wrapper.appendChild(e));
            rightColContent.push(wrapper);
          }
        });
      });
    }
  }

  // 3. Build the table rows
  // First row: header
  // Second row: two columns (image, all icon-title sections)
  const cells = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // 4. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
