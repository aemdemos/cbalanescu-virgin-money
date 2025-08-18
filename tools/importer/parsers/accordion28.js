/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row - matches example
  const headerRow = ['Accordion (accordion28)'];
  const cells = [headerRow];

  // Find all accordion items: each .filtered-content
  const accordionItems = element.querySelectorAll('.filtered-content');
  accordionItems.forEach((item) => {
    // Title cell: use data-title attribute
    let titleEl;
    const titleText = item.getAttribute('data-title');
    if (titleText && titleText.trim()) {
      titleEl = document.createElement('div');
      titleEl.textContent = titleText.trim();
    } else {
      // Fallback: Use the first heading inside
      const heading = item.querySelector('h2,h3,h4,h5,h6');
      if (heading) {
        titleEl = heading;
      } else {
        titleEl = document.createElement('div');
        titleEl.textContent = 'Accordion item';
      }
    }

    // Content cell: reference the whole .column-container (may be null)
    const contentContainer = item.querySelector('.column-container');
    cells.push([titleEl, contentContainer ? contentContainer : document.createElement('div')]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
