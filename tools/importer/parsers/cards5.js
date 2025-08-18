/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Each .sl-item may contain multiple card sections
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  slItems.forEach((slItem) => {
    // Skip pure rich-text intro block
    if (slItem.querySelector('.cm-rich-text')) return;
    // Find each section.cm-icon-title (card)
    const cardSections = Array.from(slItem.querySelectorAll(':scope > section.cm-icon-title'));
    cardSections.forEach(section => {
      // First cell: image/icon
      const img = section.querySelector('.header img');
      // Second cell: text content (heading and description)
      const title = section.querySelector('.header h2');
      const desc = section.querySelector('.content p');
      // Compose text cell (preserving strong for heading and paragraph for description)
      const cellContent = document.createElement('div');
      if (title) {
        // Use <strong> for card heading to match example semantics
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        cellContent.appendChild(strong);
      }
      if (desc) {
        if (title) cellContent.appendChild(document.createElement('br'));
        // Reference existing paragraph node directly
        cellContent.appendChild(desc);
      }
      rows.push([
        img || '',
        cellContent
      ]);
    });
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
