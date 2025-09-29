/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per instructions
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find all cards (sl-item)
  const cardItems = element.querySelectorAll(':scope .sl-list > .sl-item');

  cardItems.forEach((item) => {
    // Find the link inside the card
    const link = item.querySelector('a.cm-image-block-link');
    if (!link) return; // Defensive: skip if no link

    // Get the image element (use the actual <img>)
    const imgDiv = link.querySelector('.image');
    let imgEl = imgDiv ? imgDiv.querySelector('img') : null;
    // Defensive: skip if no image
    if (!imgEl) return;

    // Get the heading/title
    const contentDiv = link.querySelector('.content');
    let titleEl = contentDiv ? contentDiv.querySelector('h2') : null;
    // Defensive: skip if no title
    if (!titleEl) return;

    // Compose the text cell: use only the heading text
    const textCell = document.createElement('div');
    textCell.appendChild(titleEl.cloneNode(true));

    // Add the row: [image, text content]
    rows.push([
      imgEl,
      textCell
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
