/* global WebImporter */
export default function parse(element, { document }) {
  // Find all .cm-content-tile sections (each card)
  const cardSections = element.querySelectorAll('section.cm-content-tile');

  // Header row as per block spec (must be exactly one column)
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  cardSections.forEach((section) => {
    // Image: first <img> inside .image
    const imageDiv = section.querySelector('.image');
    let imgEl = null;
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }

    // Text content: title, description, CTAs
    const contentDiv = section.querySelector('.content');
    const textCell = [];
    if (contentDiv) {
      // Title (h3, preserve bold)
      const title = contentDiv.querySelector('h3');
      if (title) textCell.push(title);

      // Description: first non-empty <p> that isn't a subheading and doesn't contain links
      const pTags = Array.from(contentDiv.querySelectorAll('p'));
      const desc = pTags.find(p => p.textContent.trim().length > 0 && !p.classList.contains('subheading') && p.querySelectorAll('a').length === 0);
      if (desc) textCell.push(desc);

      // CTAs: all <a> inside <p> with links
      pTags.forEach(p => {
        if (p.querySelectorAll('a').length > 0) {
          p.querySelectorAll('a').forEach(a => textCell.push(a));
        }
      });
    }

    rows.push([
      imgEl ? imgEl : '',
      textCell.length > 0 ? textCell : ''
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
