/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Columns (columns7)'];

  // Defensive: find the outer sl-list with feature-right
  const slListFeatureRight = element.querySelector('.sl-list.has-feature-right');
  if (!slListFeatureRight) return;
  const slItems = slListFeatureRight.querySelectorAll(':scope > .sl-item');
  if (slItems.length !== 2) return; // Expect 2 columns

  // First column: image
  let leftColContent = null;
  const leftSection = slItems[0].querySelector('section.cm-image');
  if (leftSection) {
    // Reference the whole section for resilience
    leftColContent = leftSection;
  }

  // Second column: all icon-title sections
  let rightColContent = [];
  const rightColContainer = slItems[1].querySelector('.column-container');
  if (rightColContainer) {
    const rightSlList = rightColContainer.querySelector('.sl-list.has-2-items');
    if (rightSlList) {
      const rightSlItems = rightSlList.querySelectorAll(':scope > .sl-item');
      rightSlItems.forEach(slItem => {
        // Each slItem contains one (left) or several (right) icon-title sections
        const iconSections = slItem.querySelectorAll('section.cm-icon-title');
        iconSections.forEach(sec => {
          rightColContent.push(sec);
        });
      });
    }
  }

  // Assemble the block table cells
  // Row 2: two columns: leftColContent, rightColContent
  // rightColContent can be array (multiple sections)
  const cells = [
    headerRow,
    [leftColContent, rightColContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
