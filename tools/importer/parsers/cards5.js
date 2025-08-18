/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header must exactly match per requirements
  const headerRow = ['Cards (cards5)'];
  const cells = [headerRow];

  // The list of cards is in .sl-list, under .sl-item > .cm.cm-icon-title
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Each .sl-item may have one or more sections (.cm.cm-icon-title)
  const slItems = Array.from(slList.querySelectorAll('.sl-item'));
  const cardSections = [];
  slItems.forEach((item) => {
    const sections = Array.from(item.querySelectorAll('section.cm.cm-icon-title'));
    if (sections.length > 0) {
      sections.forEach(section => cardSections.push(section));
    }
  });

  // For each card, extract icon (mandatory), title (optional), description (optional)
  cardSections.forEach(section => {
    // 1st cell: the image/icon element in .header img
    const img = section.querySelector('.header img');

    // 2nd cell: heading (h2.header) and content (p)
    const heading = section.querySelector('.header h2');
    // Retain heading and paragraph DOM nodes if present
    const contentDiv = section.querySelector('.content');
    let description = null;
    if (contentDiv) {
      description = contentDiv.querySelector('p');
    }
    // Combine heading and description, only if they exist
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);

    cells.push([img, textCell]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
