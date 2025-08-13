/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards38) table header row
  const headerRow = ['Cards (cards38)'];
  const cells = [headerRow];

  // Find all card sections in structured order
  const slItems = element.querySelectorAll('.sl-item');
  slItems.forEach(slItem => {
    const cardSections = slItem.querySelectorAll('section.cm-content-tile, section.cm.cm-content-tile');
    cardSections.forEach(section => {
      // --- First cell: Image (reference)
      let img = section.querySelector('.image img');
      // --- Second cell: All text content
      const contentDiv = section.querySelector('.content');
      let textEls = [];
      if (contentDiv) {
        // Collect all element children (keep order and semantics)
        Array.from(contentDiv.children).forEach(child => {
          // Only include elements with actual content
          if (child.textContent && child.textContent.trim()) {
            textEls.push(child);
          }
        });
      }
      // If no image, use empty string so table structure is correct
      // If no text content, use empty string
      cells.push([
        img || '',
        textEls.length > 0 ? (textEls.length === 1 ? textEls[0] : textEls) : ''
      ]);
    });
  });

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
