/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row
  const cells = [
    ['Cards (cards17)'],
  ];

  // Find all card items
  const slList = element.querySelector('.sl-list');
  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    items.forEach((item) => {
      // Each sl-item contains a section.cm-content-tile
      const section = item.querySelector('section.cm-content-tile');
      if (!section) return;

      // Image cell - get the <img> inside .image
      let imageCell = '';
      const imageDiv = section.querySelector('.image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }

      // Text cell - reference the .content div (contains all heading, description, lists, CTAs)
      let textCell = '';
      const contentDiv = section.querySelector('.content');
      if (contentDiv) {
        textCell = contentDiv;
      }

      cells.push([imageCell, textCell]);
    });
  }

  // Create the table block and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
