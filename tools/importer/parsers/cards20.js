/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: matches example exactly
  const headerRow = ['Cards (cards20)'];
  const rows = [];

  // Find all card items (sl-item inside sl-list)
  const cardItems = element.querySelectorAll('.sl-list > .sl-item');
  cardItems.forEach((item) => {
    // Image: find first img inside .image
    let img = null;
    const imgDiv = item.querySelector('.image');
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }

    // Text: find title (h2.header), and check for description (none in sample HTML)
    let textCell = [];
    const h2 = item.querySelector('.content .header');
    if (h2) textCell.push(h2);
    // There is no additional description or CTA in this HTML, so nothing else to add
    // If in future, description or CTA (e.g., a link) are present, add them below
    // Example:
    // const desc = item.querySelector('.content p');
    // if (desc) textCell.push(desc);
    // const link = item.querySelector('.cm-image-block-link:not([class*="image-block-link"])');
    // if (link) textCell.push(link);

    rows.push([img, textCell]); // Always use an array for text cell to keep semantic grouping
  });

  // Compose cells for createTable
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the table block
  element.replaceWith(block);
}
